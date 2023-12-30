import { useState, useRef, useEffect } from 'react';
import { REST_ENDPOINT } from '../constants';

import createHeaders from '../utils/createHeaders';

const useFetch = (): any => {
  const [newId, setId] = useState<number | null>(null);
  const [formEntry, setNewEntry] = useState<EntryType | null>(null);

  useEffect(() => {
    if (formEntry && formEntry?.content !== '') {
      (async () => {
        const requestHeaders = createHeaders();
        try {
          const response = await fetch(`${REST_ENDPOINT}/api/posts/`, {
            method: 'POST',
            body: JSON.stringify(formEntry),
            mode: 'cors',
            headers: requestHeaders,
          });
          const { id } = await response.json();
          console.log('new id :>> ', id);
          setId(id);
        } catch (error) {
          console.log(error);
          alert(error);
        }
      })();
    }
  }, [formEntry]);
  return [newId, setNewEntry];
};

const useAddForm = (onSuccess: (msg: string, entry: EntryType) => void) => {
  const [formContent, setFormContent] = useState<string>();
  const isMounted = useRef(false);
  const [id, setNewEntry] = useFetch();

  const textareaInput = useRef<HTMLTextAreaElement>();
  const dateInput = useRef<HTMLInputElement>();
  const locationsRef = useRef<HTMLTextAreaElement>();

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    let refTextareaInput = textareaInput.current || { value: '' };
    refTextareaInput.value = refTextareaInput.value.replace(pattern, replacement);

    setFormContent(refTextareaInput.value);
  }

  function handleAdd() {
    console.log('handleAdd');
    let newContent = (textareaInput as any)?.current.value.trim();
    if (newContent === '' && (locationsRef as any)?.current.value){
      newContent = JSON.parse((locationsRef as any)?.current.value)[0].title;
    }
    console.log(newContent);
    setNewEntry({
      content: newContent,
      date: (dateInput as any)?.current.value,
      locations: (locationsRef as any)?.current.value,
    });
  }

  function checkKeyPressed(e: any) {
    // console.log(`AddForm: handle key presss ${e.key}`);
    if (e.altKey && e.key === 's') {
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  }

  useEffect(() => {

    if (id !== null) {
      // This makes it so this is not called on the first render
      // but when the Id is set
      onSuccess(`Add Done : New Id: ${id}`, {
        id,
        content: formContent?.trim() || '',
        date: (dateInput as any)?.current.value || '',
      });
    } else {
      isMounted.current = true;

      textareaInput.current?.focus();
      document.addEventListener('keydown', checkKeyPressed);
      return () => document.removeEventListener('keydown', checkKeyPressed);
    }
  }, [id]);

  return { handleAdd, textChange, formContent, dateInput, textareaInput, locationsRef };
};

export default useAddForm;
