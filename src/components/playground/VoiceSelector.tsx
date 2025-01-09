import { Fragment, useEffect, useState } from 'react';

export type Voice = {
  id: string;
  name?: string;
  description: string;
  language: string;
};

type VoiceSelectorProps = {
  selectedVoice?: Voice;
  onVoiceChange: (voice: Voice) => void;
};

export const VoiceSelector = ({ selectedVoice, onVoiceChange }: VoiceSelectorProps) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_VOICE_ASSISTANT_MANAGER_URL}/api/voice/cartesia/list`,
          {
            headers: {
              'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`)}`,
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const result = await response.json();
        if (result.code === 1000) {
          setVoices(result.data);
        } else {
          throw new Error(result.msg || 'Failed to fetch voices');
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
        setVoices([]);
      }
    };

    fetchVoices();
  }, []);

  const languages = ['all', ...Array.from(new Set(voices.map(voice => voice.language)))].sort();

  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || voice.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const CountryFlag = ({ code }: { code: string }) => {
    const languageToCountry: { [key: string]: string } = {
      en: 'us',
      zh: 'cn',
      es: 'es',
      fr: 'fr',
      de: 'de',
      ja: 'jp',
      ko: 'kr',
      ru: 'ru',
      it: 'it',
      nl: 'nl',
      hi: 'in',
      pl: 'pl',
      pt: 'pt',
      tr: 'tr',
      sv: 'se',
      ar: 'sa',
      hu: 'hu',
      cs: 'cz',
      da: 'dk',
      no: 'no',
      fi: 'fi',
      ro: 'ro'
    };

    const countryCode = languageToCountry[code.toLowerCase()] || code.toLowerCase();
    return (
      <img
        src={`https://flagcdn.com/16x12/${countryCode}.png`}
        srcSet={`https://flagcdn.com/32x24/${countryCode}.png 2x,
                https://flagcdn.com/48x36/${countryCode}.png 3x`}
        width="16"
        height="12"
        alt={code}
        className="inline-block"
      />
    );
  };

  const getLanguageName = (code: string) => {
    if (!code) return '';
    if (code === 'all') return 'Any language';
    
    const languageNames: { [key: string]: string } = {
      en: 'English',
      zh: 'Chinese',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ja: 'Japanese',
      ko: 'Korean',
      ru: 'Russian',
      it: 'Italian',
      nl: 'Dutch',
      hi: 'Hindi',
      pl: 'Polish',
      pt: 'Portuguese',
      tr: 'Turkish',
      sv: 'Swedish',
      ar: 'Arabic',
      hu: 'Hungarian',
      cs: 'Czech',
      da: 'Danish',
      no: 'Norwegian',
      fi: 'Finnish',
      ro: 'Romanian'
    };
    return languageNames[code] || code.toUpperCase();
  };

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800"
        onClick={() => setIsOpen(true)}
      >
        <MicrophoneIcon className="w-4 h-4" />
        {selectedVoice ? `${getLanguageName(selectedVoice.language)} - ${selectedVoice.description.slice(0, 20)}...` : 'Select a voice...'}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-black/70" onClick={() => setIsOpen(false)} />
            
            <div className="relative w-full max-w-2xl p-6 bg-gray-900 rounded-lg shadow-xl">
              {/* <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  <button className="px-3 py-1 text-sm text-white border-b-2 border-cyan-500">Default Voices</button>
                  <button className="px-3 py-1 text-sm text-gray-400">My Voices</button>
                  <button className="px-3 py-1 text-sm text-gray-400">Starred Voices</button>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">×</button>
              </div> */}

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-gray-600"
                />
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-2 py-1.5 text-sm bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none"
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    >
                      {selectedLanguage === 'all' ? (
                        <span className="text-gray-400">Any language</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CountryFlag code={selectedLanguage} />
                          <span>{getLanguageName(selectedLanguage)}</span>
                        </div>
                      )}
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>

                    {isLanguageDropdownOpen && (
                      <div className="absolute left-0 right-0 z-10 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                        <div className="max-h-60 overflow-y-auto">
                          {languages
                            .filter(lang => lang !== 'all')
                            .map(lang => (
                              <div
                                key={lang}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer text-cyan-500"
                                onClick={() => {
                                  setSelectedLanguage(lang);
                                  setIsLanguageDropdownOpen(false);
                                }}
                              >
                                <CountryFlag code={lang} />
                                <span>{getLanguageName(lang)}</span>
                              </div>
                            ))}
                          <div
                            className="px-4 py-2 text-gray-400 hover:bg-gray-700 cursor-pointer"
                            onClick={() => {
                              setSelectedLanguage('all');
                              setIsLanguageDropdownOpen(false);
                            }}
                          >
                            Any language
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <select className="flex-1 px-2 py-1.5 text-sm bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none">
                    <option>Any gender</option>
                  </select>
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto">
                {filteredVoices.map((voice) => (
                  <div
                    key={voice.id}
                    className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md cursor-pointer border-b border-gray-700"
                    onClick={() => {
                      onVoiceChange(voice);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedVoice?.id === voice.id}
                          onChange={() => {}}
                          className="w-4 h-4 text-cyan-500"
                        />
                        <PlayIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          <CountryFlag code={voice.language} />
                          <span className="text-white">{getLanguageName(voice.language)}</span>
                        </div>
                        <span className="text-xs text-gray-400">{voice.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MicrophoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);