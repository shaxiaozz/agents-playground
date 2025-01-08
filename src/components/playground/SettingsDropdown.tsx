import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useConfig } from '@/hooks/useConfig';

export const SettingsDropdown = () => {
  const { config, setUserSettings } = useConfig();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800">
          <span>Settings</span>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-gray-900 border border-gray-800 rounded-md shadow-lg">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-gray-800' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-white justify-between cursor-pointer`}
                  onClick={() => {
                    const newSettings = { ...config.settings };
                    newSettings.inputs.camera = !newSettings.inputs.camera;
                    setUserSettings(newSettings);
                  }}
                >
                  <span>Camera</span>
                  {config.settings.inputs.camera && (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-gray-800' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-white justify-between cursor-pointer`}
                  onClick={() => {
                    const newSettings = { ...config.settings };
                    newSettings.inputs.mic = !newSettings.inputs.mic;
                    setUserSettings(newSettings);
                  }}
                >
                  <span>Microphone</span>
                  {config.settings.inputs.mic && (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};