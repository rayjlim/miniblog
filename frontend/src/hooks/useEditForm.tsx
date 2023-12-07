import { useState, useEffect, useRef } from 'react';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';
import '../Types';
const useEditForm = (entry: EntryType | null, onSuccess: (msg: string, entry: EntryType) => void) => {
  const [content, setContent] = useState<string>(entry?.content || '');
  const textareaInput = useRef<HTMLTextAreaElement>(null);
  const dateInput = useRef<HTMLInputElement>(null);

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    const refTextarea = textareaInput.current || { value: '' };

    refTextarea.value = refTextarea.value.replace(pattern, replacement);
    setContent(refTextarea.value);
  }

  async function handleSave() {
    console.log('handleSave entry :');
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set(AUTH_HEADER, token);
    const newEntry = {...entry, id: entry?.id || 0, content: textareaInput.current?.value || '', date: dateInput.current?.value || ''};
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        content: textareaInput.current?.value || '',
        date: dateInput.current?.value || '',
      }),
      headers: requestHeaders
    };

    try {
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${entry?.id}`,
        {
          ...options,
          mode: 'cors',
          cache: 'no-cache',
          redirect: 'follow',
        },
      );

      console.log(response);
    } catch (error) {
      console.log(error);
      alert(error);
      onSuccess('Edit fail' + error, newEntry);
    }

    onSuccess('Edit Done', newEntry);
  }

  /**
   * The above function handles the deletion of a post by sending a DELETE request to
   * the server and displaying a success message or an error message.
   * @returns The function `handleDelete` returns nothing (`undefined`).
   */
  async function handleDelete() {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    const id = entry?.id || 0;
    console.log(`handleDelete ${id}`);

    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set(AUTH_HEADER, token);

    try {
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: requestHeaders
        },
      );

      console.log(response);

    } catch (error) {
      console.log(error);
      alert(error);
    }
    onSuccess('Delete Done', {id, content: 'DELETE', date: ''});
  }

  function checkKeyPressed(e: any) {
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // Note: this is a hack because the content value is taken from the init value
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  }

  useEffect(() => {
    console.log('EditForm: useEffect');

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);
  return { textareaInput, content, dateInput, handleDelete, textChange, handleSave };
};

export default useEditForm;

