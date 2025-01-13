import { Fragment, useState, useEffect } from 'react';

type SpeedOption = {
  value: number;
  label: string;
  description: string;
};

const speedOptions: SpeedOption[] = [
  { value: -1.0, label: 'Slowest', description: 'Very slow speech' },
  { value: -0.5, label: 'Slow', description: 'Slower than normal speech' },
  { value: 0, label: 'Normal', description: 'Default speech rate' },
  { value: 0.5, label: 'Fast', description: 'Faster than normal speech' },
  { value: 1.0, label: 'Fastest', description: 'Very fast speech' }
];

type EmotionLevel = 'lowest' | 'low' | 'high' | 'highest';

type EmotionState = {
  name: string;
  level: EmotionLevel | null;
};

const emotions = ['anger', 'positivity', 'surprise', 'sadness', 'curiosity'];
const emotionLevels: EmotionLevel[] = ['lowest', 'low', 'high', 'highest'];

type SpeedEmotionSelectorProps = {
  defaultSpeed?: string;
  defaultEmotion?: string;
  onUpdate?: (data: any) => void;
};

export const SpeedEmotionSelector = ({ defaultSpeed, defaultEmotion, onUpdate }: SpeedEmotionSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedOption>(speedOptions[2]);
  const [emotionStates, setEmotionStates] = useState<EmotionState[]>(
    emotions.map(emotion => ({ name: emotion, level: null }))
  );
  const [previousSpeed, setPreviousSpeed] = useState(defaultSpeed);
  const [previousEmotion, setPreviousEmotion] = useState(defaultEmotion);

  const hasChanges = () => {
    const currentSpeed = selectedSpeed.label.toLowerCase();
    const currentEmotion = emotionStates
      .filter(e => e.level !== null)
      .map(e => `${e.name}:${e.level}`)
      .join(',');
    
    return currentSpeed !== previousSpeed || currentEmotion !== previousEmotion;
  };

  const updateSpeedEmotion = async () => {
    try {
      const currentEmotion = emotionStates
        .filter(e => e.level !== null)
        .map(e => `${e.name}:${e.level}`)
        .join(',');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_VOICE_ASSISTANT_MANAGER_URL}/api/voice-assistant/update-voice-speed-emotio`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`)}`,
          },
          body: JSON.stringify({
            voice_speed: selectedSpeed.label.toLowerCase(),
            voice_emotio: currentEmotion
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update speed and emotion');
      }

      const result = await response.json();
      if (result.code === 1000) {
        setPreviousSpeed(result.now_voice_speed);
        setPreviousEmotion(result.now_voice_emotion);
        onUpdate?.(result);
      }
    } catch (error) {
      console.error('Error updating speed and emotion:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (hasChanges()) {
      updateSpeedEmotion();
    }
  };

  useEffect(() => {
    if (defaultSpeed) {
      const speedOption = speedOptions.find(option => 
        option.label.toLowerCase() === defaultSpeed.toLowerCase()
      );
      if (speedOption) {
        setSelectedSpeed(speedOption);
      }
    }
  }, [defaultSpeed]);

  useEffect(() => {
    if (defaultEmotion) {
      const newEmotionStates: EmotionState[] = emotions.map(emotion => ({ 
        name: emotion, 
        level: null as EmotionLevel | null 
      }));

      const emotionPairs = defaultEmotion.split(',');
      emotionPairs.forEach(pair => {
        const [name, level] = pair.split(':');
        const index = newEmotionStates.findIndex(e => e.name === name);
        if (index !== -1 && level) {
          newEmotionStates[index] = {
            name: newEmotionStates[index].name,
            level: level as EmotionLevel
          };
        }
      });

      setEmotionStates(newEmotionStates);
    }
  }, [defaultEmotion]);

  const handleEmotionChange = (emotionName: string, level: EmotionLevel | null) => {
    setEmotionStates(prev => 
      prev.map(emotion => 
        emotion.name === emotionName ? { name: emotion.name, level } : emotion
      )
    );
  };

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 whitespace-nowrap overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <SettingsIcon className="w-4 h-4" />
        <span className="truncate">Speed/Emotion</span>
        <ChevronDownIcon className="w-4 h-4 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-black/70" onClick={handleClose} />
            
            <div className="relative w-full max-w-md p-6 bg-gray-900/95 rounded-lg shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-white">Speed/Emotion</h3>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-white">
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="relative pt-6">
                    <div 
                      className="absolute left-0 right-0 h-2 bg-gray-700 cursor-pointer rounded-full"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        const index = Math.round(percentage * (speedOptions.length - 1));
                        setSelectedSpeed(speedOptions[index]);
                      }}
                    >
                      {speedOptions.map((option, index) => (
                        <div
                          key={option.value}
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: `${(index * 100) / (speedOptions.length - 1)}%` }}
                        >
                          <button
                            className={`w-3 h-3 rounded-full transition-all ${
                              selectedSpeed.value === option.value 
                                ? 'bg-white scale-150' 
                                : 'bg-gray-500 hover:bg-gray-400'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSpeed(option);
                            }}
                          />
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="text-xs text-gray-400">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-12 text-sm text-gray-300 text-center">
                    {selectedSpeed.description}
                  </div>
                </div>

                <div className="space-y-2">
                  {emotionStates.map((emotion) => (
                    <div key={emotion.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 capitalize">{emotion.name}</span>
                        {emotion.level && (
                          <button 
                            onClick={() => handleEmotionChange(emotion.name, null)}
                            className="text-xs text-gray-500 hover:text-gray-400"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {emotionLevels.map((level) => (
                          <button
                            key={level}
                            className={`flex-1 px-2 py-1 text-xs rounded-md transition-all ${
                              emotion.level === level
                                ? 'bg-white text-gray-900'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                            onClick={() => handleEmotionChange(emotion.name, level)}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="3" strokeWidth="2" />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
    />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
); 