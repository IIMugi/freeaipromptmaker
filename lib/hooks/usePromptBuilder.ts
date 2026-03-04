import { useState, useMemo, useEffect, useCallback } from 'react';
import {
    buildPrompt,
    getModelDefaults,
    getModelInfo,
    validatePromptLength,
    type AIModel,
    type PromptHistory,
} from '@/lib/prompt-builder';
import { useLocalStorage } from '@/lib/hooks';
import { copyToClipboard, generateId } from '@/lib/utils';
import { getStyleValues } from '@/components/Generator/StyleCards';
import type { CopyVariant } from '@/components/Generator/LivePreview';

export type BuilderMode = 'quick' | 'pro';

export function usePromptBuilder(prefilledConcept: string = '') {
    const [mode, setMode] = useState<BuilderMode>('quick');
    const [model, setModel] = useState<AIModel>('flux');
    const [mainConcept, setMainConcept] = useState('');
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [lighting, setLighting] = useState('');
    const [camera, setCamera] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [stylize, setStylize] = useState(100);
    const [chaos, setChaos] = useState(0);

    const [history, setHistory] = useLocalStorage<PromptHistory[]>('prompt-history', []);
    const [showHistory, setShowHistory] = useState(false);
    const [copyVariantState, setCopyVariantState] = useState<CopyVariant | null>(null);
    const [modelSwitchHint, setModelSwitchHint] = useState('');

    const modelInfo = getModelInfo(model);
    const supportsNegativePrompt = modelInfo?.supportsNegative ?? false;

    const selectedStyleValues = useMemo(() => getStyleValues(selectedStyles), [selectedStyles]);

    const generatedPrompt = useMemo(
        () =>
            buildPrompt({
                model,
                mainConcept,
                styles: selectedStyleValues,
                lighting,
                camera,
                aspectRatio,
                stylize,
                chaos,
                negativePrompt,
            }),
        [
            aspectRatio,
            camera,
            chaos,
            lighting,
            mainConcept,
            model,
            negativePrompt,
            selectedStyleValues,
            stylize,
        ]
    );

    const promptValidation = useMemo(
        () => (generatedPrompt ? validatePromptLength(generatedPrompt, model) : { valid: true }),
        [generatedPrompt, model]
    );

    const outputConfidence = useMemo(() => {
        let score = 0;
        if (mainConcept.trim()) score += 35;
        if (selectedStyles.length) score += Math.min(24, selectedStyles.length * 6);
        if (lighting || camera) score += 14;
        if (!supportsNegativePrompt || negativePrompt.trim()) score += 10;
        if (aspectRatio) score += 10;
        if (mainConcept.trim().length >= 35) score += 7;
        return Math.min(100, score);
    }, [aspectRatio, camera, lighting, mainConcept, negativePrompt, selectedStyles.length, supportsNegativePrompt]);

    const syntaxQuality = useMemo(() => {
        let score = 62;
        if (generatedPrompt) score += 14;
        if (promptValidation.valid) score += 14;
        if (selectedStyles.length > 0) score += 6;
        if (!supportsNegativePrompt || negativePrompt.trim()) score += 4;
        return Math.min(100, score);
    }, [generatedPrompt, negativePrompt, promptValidation.valid, selectedStyles.length, supportsNegativePrompt]);

    // Handle prefilled concept from URL
    useEffect(() => {
        if (!prefilledConcept || mainConcept.trim() === prefilledConcept) return;
        const timer = window.setTimeout(() => {
            setMainConcept(prefilledConcept);
            setMode('quick');
        }, 0);
        return () => window.clearTimeout(timer);
    }, [mainConcept, prefilledConcept]);

    // Model switch hint timer
    useEffect(() => {
        if (!modelSwitchHint) return;
        const timer = setTimeout(() => setModelSwitchHint(''), 2200);
        return () => clearTimeout(timer);
    }, [modelSwitchHint]);

    const handleModelChange = useCallback((newModel: AIModel) => {
        if (newModel === model) return;

        setModel(newModel);
        const defaults = getModelDefaults(newModel);
        if (defaults.aspectRatio) setAspectRatio(defaults.aspectRatio);
        if (defaults.stylize !== undefined) setStylize(defaults.stylize);
        if (defaults.chaos !== undefined) setChaos(defaults.chaos);

        if (mainConcept.trim()) {
            const nextModel = getModelInfo(newModel);
            if (nextModel) {
                setModelSwitchHint(`Syntax translated for ${nextModel.name}`);
            }
        }
    }, [model, mainConcept]);

    const handleToggleStyle = useCallback((styleId: string) => {
        setSelectedStyles((prev) =>
            prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
        );
    }, []);

    const handleClearStyles = useCallback(() => {
        setSelectedStyles([]);
    }, []);

    const savePromptToHistory = useCallback((promptValue: string) => {
        if (!promptValue) return;

        setHistory((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.prompt === promptValue && item.model === model
            );

            if (existingIndex >= 0) {
                const existing = prev[existingIndex];
                const remaining = prev.filter((_, index) => index !== existingIndex);
                return [{ ...existing, timestamp: new Date().toISOString() }, ...remaining].slice(0, 20);
            }

            const newEntry: PromptHistory = {
                id: generateId(),
                prompt: promptValue,
                model,
                timestamp: new Date().toISOString(),
            };

            return [newEntry, ...prev].slice(0, 20);
        });
    }, [model, setHistory]);

    const buildCopyVariant = useCallback((variant: CopyVariant) => {
        if (variant === 'json') {
            return JSON.stringify(
                {
                    model,
                    prompt: generatedPrompt,
                    negativePrompt: negativePrompt || null,
                    styles: selectedStyleValues,
                    lighting: lighting || null,
                    camera: camera || null,
                    aspectRatio,
                    generatedAt: new Date().toISOString(),
                },
                null,
                2
            );
        }

        if (variant === 'with-negative') {
            if (!negativePrompt.trim()) return generatedPrompt;
            const hasNegative = /negative prompt:|--no|negative:/i.test(generatedPrompt);
            if (hasNegative) return generatedPrompt;
            return `${generatedPrompt}\n\nNegative prompt: ${negativePrompt.trim()}`;
        }

        return generatedPrompt;
    }, [aspectRatio, camera, generatedPrompt, lighting, model, negativePrompt, selectedStyleValues]);

    const handleCopyVariant = useCallback(async (variant: CopyVariant) => {
        if (!generatedPrompt) return;

        const text = buildCopyVariant(variant);
        const copied = await copyToClipboard(text);
        if (!copied) return;

        setCopyVariantState(variant);
        if (variant !== 'json') {
            savePromptToHistory(generatedPrompt);
        }
        setTimeout(() => setCopyVariantState(null), 1800);
    }, [buildCopyVariant, generatedPrompt, savePromptToHistory]);

    const handleLoadFromHistory = useCallback((prompt: string) => {
        setMainConcept(prompt);
        setMode('pro');
    }, []);

    const handleClearHistory = useCallback(() => setHistory([]), [setHistory]);

    const handleDuplicateHistory = useCallback((id: string) => {
        setHistory((prev) => {
            const target = prev.find((item) => item.id === id);
            if (!target) return prev;
            const duplicated: PromptHistory = {
                ...target,
                id: generateId(),
                timestamp: new Date().toISOString(),
                pinned: false,
            };
            return [duplicated, ...prev].slice(0, 20);
        });
    }, [setHistory]);

    const handleToggleFavorite = useCallback((id: string) => {
        setHistory((prev) =>
            prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
        );
    }, [setHistory]);

    const handleTogglePinned = useCallback((id: string) => {
        setHistory((prev) =>
            prev.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item))
        );
    }, [setHistory]);

    const handleRemixHistory = useCallback((id: string) => {
        const target = history.find((item) => item.id === id);
        if (!target) return;
        setMainConcept(target.prompt);
        setMode('pro');
        setShowHistory(false);
    }, [history]);

    const draft = useMemo(() => ({
        subject: mainConcept.trim() || 'Define subject, mood, and context.',
        style:
            selectedStyleValues.length > 0
                ? selectedStyleValues.slice(0, 3).join(', ')
                : 'Select styles to shape visual direction.',
        camera:
            [lighting, camera].filter(Boolean).join(', ') || 'Lighting/camera cues are optional but recommended.',
        negative:
            supportsNegativePrompt
                ? negativePrompt.trim() || 'Add artifact filters for cleaner outputs.'
                : 'This model relies on natural language constraints.',
        modelSyntax: `${modelInfo?.name || model} formatting active`,
    }), [camera, lighting, mainConcept, model, modelInfo?.name, negativePrompt, selectedStyleValues, supportsNegativePrompt]);

    return {
        state: {
            mode,
            model,
            mainConcept,
            selectedStyles,
            lighting,
            camera,
            negativePrompt,
            aspectRatio,
            stylize,
            chaos,
            history,
            showHistory,
            copyVariantState,
            modelSwitchHint,
        },
        computed: {
            generatedPrompt,
            promptValidation,
            outputConfidence,
            syntaxQuality,
            draft,
            modelInfo,
            supportsNegativePrompt,
        },
        actions: {
            setMode,
            setMainConcept,
            setLighting,
            setCamera,
            setNegativePrompt,
            setAspectRatio,
            setStylize,
            setChaos,
            setShowHistory,
            handleModelChange,
            handleToggleStyle,
            handleClearStyles,
            handleCopyVariant,
            handleLoadFromHistory,
            handleClearHistory,
            handleDuplicateHistory,
            handleToggleFavorite,
            handleTogglePinned,
            handleRemixHistory,
        }
    };
}
