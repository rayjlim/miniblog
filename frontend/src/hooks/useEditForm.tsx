import { useState, useEffect, useRef } from 'react';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';

const useEditForm = (entry: any, onSuccess: (msg: string)=>void) => {

  const escapedContent = entry?.content.replace(
    /<br\s*\/>/g,
    `
`,
  );
  const [content, setContent] = useState<string>(escapedContent);
  const [date, setDate] = useState<string>(entry.date);
  const textareaInput = useRef<HTMLTextAreaElement>(null);

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    const refTextarea = textareaInput.current || { value: '' };
    // console.log('textarea.value :>> ', refTextarea.value);
    refTextarea.value = refTextarea.value.replace(pattern, replacement);

    setContent(refTextarea.value);
  }

  async function handleSave() {
    console.log('handleSave entry :', content, date);
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set(AUTH_HEADER, token);
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        content,
        date,
      }),
      headers: requestHeaders
    };

    try {
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${entry.id}`,
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
      onSuccess('Edit fail' + error);
    }

    onSuccess('Edit Done');
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
    const { id } = entry;
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
    onSuccess('Delete Done');
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
  }, [entry.content]);
  return {handleDelete, textareaInput, textChange, content, handleSave, setDate, date};
};

export default useEditForm;
