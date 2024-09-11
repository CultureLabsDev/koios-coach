import { VectorStoreFiles } from '@interfaces/assistant';

type Props = {
  assistant_id: string;
  files?: VectorStoreFiles;
  client_id: string;
};
export default ({ assistant_id, files, client_id }: Props) => (
  <div>
    <div class="grid grid-cols-3 gap-4 bg-base-100 items-center px-6 py-2 rounded-lg mb-4">
      <div class="text-xl text-neutral-600 w-20">Assistant</div>
      <div class="text-xl text-primary">{assistant_id}</div>
    </div>
    <div class="text-2xl text-primary"> Files</div>
    <div class="flex flex-col gap-2 justify-center mb-8">
      {files?.data.map((file) => (
        <div id={file.id} class="flex gap-2 bg-base-100 p-2 rounded-lg justify-between px-8">
          <div class="w-96">{file.id}</div>
          <div>{Number(file.usage_bytes / 1024 / 1024).toFixed(2)} MB</div>
          <div 
            hx-delete={`/admin/clients/${client_id}/assistant`} 
            hx-target={`#${file.id}`}
            hx-swap="outerHTML"
            hx-confirm="Are you sure you want to delete this file?"
            hx-vals={`{"file_id": "${file.id}"}`}
            class="btn btn-sm btn-outline btn-error"
          >Delete</div>
        </div>
      ))}
    </div>
    <form 
      hx-encoding='multipart/form-data' 
      hx-put={`/admin/clients/${client_id}/assistant`}
      hx-target="#assistant_section"
      _='on htmx:xhr:progress(loaded, total) set #progress.value to (loaded/total)*100'
      class="flex flex-col items-center justify-center">
      <input type='file' name='file' class="file-input file-input-primary w-full mb-2" _="on change set disabled of #upload to false"/>
      <button id='upload' class="btn btn-primary btn-outline w-full" disabled>
          Upload
      </button>
      <progress id='progress' value='0' max='100' class="progress progress-secondary w-full mt-2"></progress>
    </form>
  </div>
);
