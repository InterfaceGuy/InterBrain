import { Plugin, TFile, WorkspaceLeaf, Notice, Modal } from 'obsidian';

export default class MyPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'create-folder-and-readme',
            name: 'Create Folder and README',
            callback: async () => {
                new Notice("Enter the folder name in the next prompt");
                const folderName = await this.displayPrompt("Enter folder name");
                
                if (folderName) {
                    const folder = await this.app.vault.createFolder(folderName);
                    const readmePath = `${folder.path}/README.md`;
                    await this.app.vault.create(readmePath, '');
                    const readmeFile: TFile = this.app.vault.getAbstractFileByPath(readmePath) as TFile;

                    const leaf = this.app.workspace.activeLeaf;
                    if (leaf) {
                        leaf.openFile(readmeFile);
                    }
                }
            },
        });
    }

	async displayPrompt(prompt: string): Promise<string> {
	    return new Promise((resolve) => {
	        let modal = new Modal(this.app);
	        
	        let div = document.createElement('div');
	        div.innerHTML = `
	            <h3>${prompt}</h3>
	            <input type="text" id="folder-input"/>
	            <button type="button" id="folder-submit">Submit</button>
	        `;
	
	        modal.contentEl.appendChild(div);
	        
	        let inputEl = div.querySelector<HTMLInputElement>("#folder-input");
	        let buttonEl = div.querySelector<HTMLButtonElement>("#folder-submit");
	
	        if (buttonEl && inputEl) {  // Check for nullish values
	            buttonEl.onclick = () => {
	                resolve(inputEl?.value ?? '');  // Use nullish coalescing
	                modal.close();
	            };
	        }
	
	        modal.open();
	    });
	}
}