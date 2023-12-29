import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

const useEditForm = (entry: EntryType | null, onSuccess: (msg: string, entry: EntryType) => void) => {
  const [content, setContent] = useState<string>(entry?.content || '');
  const textareaInput = useRef<HTMLTextAreaElement>(null);
  const dateInput = useRef<HTMLInputElement>(null);
  const locationsInput = useRef<HTMLTextAreaElement>();

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    const refTextarea = textareaInput.current || { value: '' };
    refTextarea.value = refTextarea.value.replace(pattern, replacement);
    setContent(refTextarea.value);
  }

  function locationChange(){

  }

  async function handleSave() {
    console.log('handleSave entry :');
    const requestHeaders = createHeaders();
    const newEntry = { ...entry,
      content: textareaInput.current?.value || '',
      date: dateInput.current?.value || '',
      locations: locationsInput.current?.value || ""
    };
    const options = {
      method: 'PUT',
      body: JSON.stringify(newEntry),
      headers: requestHeaders,
      mode: 'cors'
    } as any;

    try {
      const response = await fetch(`${REST_ENDPOINT}/api/posts/${entry?.id}`, options);

      console.log(response);
    } catch (error) {
      console.log(error);
      toast((error as any).message);
      onSuccess('Edit fail' + error, newEntry as EntryType);
    }

    onSuccess('Edit Done', newEntry as EntryType);
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

      console.log(response);
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
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);
  return { textareaInput, content, dateInput, locationsInput, locationChange, handleDelete, textChange, handleSave };
};

export default useEditForm;

