import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';
import { EntryType } from '../Types';

const useEditForm = (entry: EntryType | null, onSuccess: (msg: string, entry: EntryType) => void) => {
  const [markdownContent, setMarkdownContent] = useState<string>(entry?.content || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const locationsRef = useRef<HTMLTextAreaElement>();

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    const textarea = formRef.current?.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = textarea?.value.replace(pattern, replacement);
      setMarkdownContent(textarea.value);
    }
  }

  function handleSave() {
    const textarea = formRef.current?.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    const dateInput = formRef.current?.querySelector('input[name="dateInput"]') as HTMLInputElement;
    const newEntry = {
      ...entry,
      content: textarea?.value || '',
      date: dateInput?.value || '',
      locations: locationsRef.current?.value || ''
    };
    const requestHeaders = createHeaders();
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
    const content = formRef.current?.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (content) {
      content.focus();
      const textLength = content.value.length;
      content.setSelectionRange(textLength, textLength);
    }
    const locations = formRef.current?.querySelector('textarea[name="locationContent"]') as HTMLTextAreaElement;
    if (locations) {
      const locationJson = entry?.locations ? JSON.stringify(entry?.locations, null, 2) : '';
      if (locationJson.startsWith('"')) {
        const temp = locationJson.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '');
        locations.value = temp;
      } else {
        locations.value = locationJson;
      }
    }

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);
  return {
    formRef,
    markdownContent,
    textChange,
    handleSave,
    handleDelete,
    isLoading
  };
};

export default useEditForm;

