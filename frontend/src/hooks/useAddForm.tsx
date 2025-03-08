import { useState, useRef, useEffect, RefObject } from 'react';
import { REST_ENDPOINT } from '../constants';
import { EntryType } from '../Types';
import createHeaders from '../utils/createHeaders';

const useFetch = (): any => {
  const [newId, setId] = useState<number | null>(null);
  const [formEntry, setNewEntry] = useState<EntryType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (formEntry && formEntry?.content !== '') {
      setIsLoading(true);
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
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          alert(error);
        }
      })();
    }
  }, [formEntry]);
  return [newId, setNewEntry, isLoading];
};
interface AddHookParams {
  onSuccess: (msg: string, entry: EntryType) => void;
};

const useAddForm = ({ onSuccess }: AddHookParams) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [markdownContent, setMarkdownContent] = useState<string>(''); // For preview
  const isMounted = useRef(false);
  const [id, setNewEntry, isLoading] = useFetch();

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    const content = formRef.current?.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (content) {
      content.value = content?.value.replace(pattern, replacement);
      setMarkdownContent(content.value);
    }
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    console.log('handleAdd');
    event.preventDefault();
    const content = formRef.current?.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    const dateInput = formRef.current?.querySelector('input[name="dateInput"]') as HTMLInputElement;
    const locations = formRef.current?.querySelector('textarea[name="locationContent"]') as HTMLTextAreaElement;

    if (content.value === '' && locations.value !== '') {
      content.value = JSON.parse(locations.value)[0].title;
    }
    console.log(content.value);
    setNewEntry({
      content: content.value,
      date: (dateInput as any)?.value,
      locations: locations.value,
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
      const content = formRef.current?.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
      const dateInput = formRef.current?.querySelector('input[name="dateInput"]') as HTMLInputElement;
      const locations = formRef.current?.querySelector('input[name="locationContent"]') as HTMLInputElement;
      onSuccess(`Add Done : New Id: ${id}`, {
        id,
        content: content?.value.trim() || '',
        date: (dateInput as any)?.value || '',
        locations: locations?.value || '',
      });

    } else {
      isMounted.current = true;
      const content = formRef.current?.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
      content.focus();
      document.addEventListener('keydown', checkKeyPressed);
      return () => document.removeEventListener('keydown', checkKeyPressed);
    }
  }, [id]);

  return { formRef, handleAdd, textChange, markdownContent, isLoading };
};

export default useAddForm;
