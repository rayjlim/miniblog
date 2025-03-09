import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';
import { EntryType } from '../Types';

interface FormElements {
  content: HTMLTextAreaElement;
  dateInput: HTMLInputElement;
  locationContent: HTMLTextAreaElement;
  newLocationTitle: HTMLInputElement;
  newLocationCoords: HTMLInputElement;
}

const useEditForm = (entry: EntryType | null, onSuccess: (msg: string, entry: EntryType) => void) => {
  const [markdownContent, setMarkdownContent] = useState<string>(entry?.content || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const getFormElements = (): FormElements | null => {
    if (!formRef.current) return null;

    return {
      content: formRef.current.querySelector('textarea[name="content"]') as HTMLTextAreaElement,
      dateInput: formRef.current.querySelector('input[name="dateInput"]') as HTMLInputElement,
      locationContent: formRef.current.querySelector('textarea[name="locationContent"]') as HTMLTextAreaElement,
      newLocationTitle: formRef.current.querySelector('input[name="newLocationTitle"]') as HTMLInputElement,
      newLocationCoords: formRef.current.querySelector('input[name="newLocationCoords"]') as HTMLInputElement,
    };
  };

  const textChange = () => {
    const elements = getFormElements();
    if (!elements) return;

    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    elements.content.value = elements.content.value.replace(pattern, replacement);
    setMarkdownContent(elements.content.value);
  };

  const handleSave = async () => {
    const elements = getFormElements();
    if (!elements) return;
    if((elements.newLocationCoords.value !== '' ||
      elements.newLocationTitle.value !== '')
       && !confirm('Location data present?')) return;

    const newEntry = {
      ...entry,
      content: elements.content.value,
      date: elements.dateInput.value,
      locations: elements.locationContent.value
    };

    setIsLoading(true);
    try {
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${entry?.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(newEntry),
          mode: 'cors',
          headers: createHeaders()
        }
      );
      const results = await response.json();
      console.log(results);
      onSuccess('Edit Done', newEntry as EntryType);
    } catch (error) {
      console.error(error);
      toast((error as Error).message);
      onSuccess(`Edit failed: ${(error as Error).message}`, newEntry as EntryType);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('You sure?')) return;

    const id = entry?.id || 0;
    try {
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: createHeaders()
        }
      );
      const results = await response.json();
      console.log(results);
      onSuccess('Delete Done', { id, content: 'DELETE', date: '' });
    } catch (error) {
      console.error(error);
      toast((error as Error).message);
    }
  };

  const checkKeyPressed = (e: KeyboardEvent) => {
    if (e.altKey && e.key === 's') {
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  };

  useEffect(() => {
    const elements = getFormElements();
    if (elements?.content) {
      elements.content.focus();
      const textLength = elements.content.value.length;
      elements.content.setSelectionRange(textLength, textLength);
    }

    document.addEventListener('keydown', checkKeyPressed as any);
    return () => document.removeEventListener('keydown', checkKeyPressed as any);
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
