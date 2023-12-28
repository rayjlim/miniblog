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
            cache: 'no-cache',
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

const useAddForm = (content: string, date: string, onSuccess: (msg: string, entry: EntryType) => void) => {
  const [formContent, setFormContent] = useState<string>(content || '');
  const [formDate, setFormDate] = useState<string>(date);
  const isMounted = useRef(false);
  const [id, setNewEntry] = useFetch();
  const textareaInput = useRef<HTMLTextAreaElement>(null);

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    let refTextareaInput = textareaInput.current || { value: '' };
    refTextareaInput.value = refTextareaInput.value.replace(pattern, replacement);

    setFormContent(refTextareaInput.value);
  }

  function dateChange(value: string) {
    console.log('value :', value);
    if (value) {
      setFormDate(value);
    }
  }

  function handleAdd() {
    console.log('handleAdd');
    setNewEntry({
      content: formContent.trim(),
      date: formDate,
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
        content: formContent.trim(),
        date: formDate,
      });
    } else {
      isMounted.current = true;

      textareaInput.current?.focus();
      document.addEventListener('keydown', checkKeyPressed);
      return () => document.removeEventListener('keydown', checkKeyPressed);
    }
  }, [id]);

  return { handleAdd, textChange, dateChange, formContent, formDate, textareaInput };
};

export default useAddForm;
