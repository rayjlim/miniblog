import { useState, useRef, useEffect } from 'react';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';

const useFetch = (): any => {
  const [newId, setId] = useState<number | null>(null);
  const [formEntry, setNewEntry] = useState<{
    content: string,
    date: string,
  }>({ content: '', date: '' });

  useEffect(() => {
    if (formEntry.content !== '') {
      (async () => {
        const token = window.localStorage.getItem(STORAGE_KEY) || '';
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'application/json');
        requestHeaders.set(AUTH_HEADER, token);
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

const useAddForm = (content: string, date: string, onSuccess: (msg: string) => void) => {
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
    console.log(`AddForm: handle key presss ${e.key}`);
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // Note: this is a hack because the content value was taken from the init value
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  }

  useEffect(() => {
    console.log(`AddForm: useEffect ${isMounted.current}`);
    if (isMounted.current && id !== null) {
      // This makes it so this is not called on the first render
      // but when the Id is set
      onSuccess(`Add Done : New Id: ${id}`);
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
