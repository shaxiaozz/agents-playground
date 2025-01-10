import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import React from 'react';
import { UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export type Assistant = {
  id: string;
  name: string;
  title: string;
  description: string;
};

type AssistantDropdownProps = {
  selectedAssistant: Assistant | undefined;
  onAssistantChange: (assistant: Assistant) => void;
  onData?: (data: any) => void;
};

export const AssistantDropdown = ({ selectedAssistant, onAssistantChange, onData }: AssistantDropdownProps) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_VOICE_ASSISTANT_MANAGER_URL}/api/voice-assistant/list`,
          {
            headers: {
              'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`)}`,
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch assistants');
        }
        const result = await response.json();
        if (result.code === 1000) {
          setAssistants(result.data);
          onData?.(result.data);
        } else {
          throw new Error(result.msg || 'Failed to fetch assistants');
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
        setAssistants([]);
      }
    };

    fetchAssistants();
  }, [onData]);

  // 组件加载时设置默认选中第一个助手
  useEffect(() => {
    if (!selectedAssistant && assistants.length > 0) {
      onAssistantChange(assistants[0]);
    }
  }, [selectedAssistant, assistants, onAssistantChange]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-800 rounded-md hover:bg-gray-800 whitespace-nowrap overflow-hidden">
          <UserIcon className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {selectedAssistant ? selectedAssistant.name : 'Select an assistant...'}
          </span>
          <ChevronDownIcon className="w-4 h-4 flex-shrink-0" />
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
            {assistants.map((assistant) => (
              <Menu.Item key={assistant.id}>
                {({ active }) => (
                  <div
                    className={`${
                      active ? 'bg-gray-800' : ''
                    } flex w-full items-center px-4 py-2 text-sm text-white justify-between cursor-pointer`}
                    onClick={() => onAssistantChange(assistant)}
                  >
                    {assistant.name}
                    {selectedAssistant?.id === assistant.id && (
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}; 