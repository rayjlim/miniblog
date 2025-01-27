import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

const useEditForm = (entry: EntryType | null, onSuccess: (msg: string, entry: EntryType) => void) => {
  const [markdownContent, setContent] = useState<string>(entry?.content || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaInput = useRef<HTMLTextAreaElement>();
  const dateInput = useRef<HTMLInputElement>();
  const locationsRef = useRef<HTMLTextAreaElement>();

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    const refTextarea = textareaInput.current || { value: '' };
    refTextarea.value = refTextarea.value.replace(pattern, replacement);
    setContent(refTextarea.value);
  }

  function handleSave() {
    console.log('handleSave entry :');
    const requestHeaders = createHeaders();
    const newEntry = {
      ...entry,
      content: textareaInput.current?.value || '',
      date: dateInput.current?.value || '',
      locations: locationsRef.current?.value || ''
    };
    const options = {
      method: 'PUT',
      body: JSON.stringify(newEntry),
      mode: 'cors',
      headers: requestHeaders
    } as any;
    setIsLoading(true);
    (async () => {
      try {
        const response = await fetch(`${REST_ENDPOINT}/api/posts/${entry?.id}`, options);
        const results = await response.json();
        console.log(results);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast((error as any).message);
        onSuccess('Edit fail' + error, newEntry as EntryType);
      }

      onSuccess('Edit Done', newEntry as EntryType);
    })()
  }

  async function handleDelete() {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    const id = entry?.id || 0;
    console.log(`handleDelete ${id}`);
    const requestHeaders = createHeaders();

    try {
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: requestHeaders
        },
      );
      const results = await response.json();
      console.log(results);
    } catch (error) {
      console.log(error);
      toast((error as any).message);
    }
    onSuccess('Delete Done', { id, content: 'DELETE', date: '' });
  }

  function checkKeyPressed(e: any) {
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // could convert this to refs instead?
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  }

  useEffect(() => {
    // console.log('EditForm: useEffect');
    textareaInput.current?.focus();
    const textLength = textareaInput.current?.value.length || 0;
    textareaInput.current?.setSelectionRange(textLength, textLength);

    if (locationsRef?.current) {
      // if(entry?.locations.indexOf('\"') >= 0){
      //   console.log('parse', entry?.locations);
      //   locationsRef.current.value =  JSON.parse(entry?.locations || '');
      // }
      const locationJson = entry?.locations ? JSON.stringify(entry?.locations, null, 2) : '';
      if(locationJson.startsWith('"')){
        const temp = locationJson.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '');
        locationsRef.current.value = temp;
      } else {
        locationsRef.current.value = locationJson;

      }

    }

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);
  return {
    textareaInput,
    markdownContent,
    dateInput,
    textChange,
    handleSave,
    handleDelete,
    locationsRef,
    isLoading
  };
};

export default useEditForm;

