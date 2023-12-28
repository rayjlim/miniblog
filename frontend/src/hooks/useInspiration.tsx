import { useState, useEffect } from 'react';
import { useQuery } from "react-query";
import { useSetting } from '../components/SettingContext';

const fetchData = async (api: string) => {
  if (api !== '') {
    const response = await fetch(api);
    const data = await response.json();
    return data;
  }
};

const useInspiration = () => {
  const { INSPIRATION_API, QUESTION_API } = useSetting() as SettingsType;
  const [isInspiration, setIsInspiration] = useState<boolean>(true);
  const [random, setRandom] = useState(0);
  const [api, setApi] = useState<string>(INSPIRATION_API);

  async function getByType(isInspiration = true) {
    console.log('getByType');
    setApi(isInspiration ? INSPIRATION_API : QUESTION_API);
    setIsInspiration(isInspiration);
    setRandom(Math.random());
  }

  const { data, error, isLoading } = useQuery(["inspiration", random], () => fetchData(api));

  const output = isInspiration ? `${data?.message} - ${data?.author}` : data?.prompt;

  function openWithPrompt(content: string) {
    // console.log(`clipboard: ${content}`);
    document.getElementById('addFormBtn')?.click();
    setTimeout(() => {
      const textareaInput = document.getElementById('addFormTextarea') as any;
      textareaInput?.focus();

      if (textareaInput)
        textareaInput.value = `\n\n----\n**${content}** #prompt  \n`;
      const textLength = textareaInput?.value.length || 0;
      textareaInput?.setSelectionRange(textLength, textLength);
    }, 100);
  }

  function checkKeyPressed(e: KeyboardEvent) {
    if (e.altKey && e.key === 'p') {
      console.log('alt populate keybinding');
      const target = document.getElementById('populateBtn') as any;
      target?.click();
    } else if (e.altKey && e.key === '[') {
      const target = document.getElementById('promptBtn') as any;
      target?.click();
    }
  }
  useEffect(() => {
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  });

  return { output, isLoading, error, getByType, openWithPrompt }
};

export default useInspiration;
