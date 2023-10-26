import * as fs from 'fs';

export enum ElementType {
    file, dir
}

export interface Elements {
    [key: string]: Element;
}

export interface Element {
    type: ElementType;
    child?: Elements;
}

export class FileStructureTool {

    verified: any[] = [];
    toFix: any[] = [];
    directoryCreated: any[] = [];


	folderCheck(folderPath: string, structure: Elements) {
		this.work(folderPath, structure, false);
		return this.toFix;
	}

	prepareStructure(folderPath: string, structure: Elements) {
		this.work(folderPath, structure, true);
		return this.directoryCreated;
	}

    work(folderPath: string, structure: Elements, createElement: Boolean) {
        for (let struElementName in structure) {
            // 0 - Preapare variables
            let struElementPath = folderPath + "/" + struElementName;
            let struElement = structure[struElementName];

            // 1 - If exist in other
            if (!fs.existsSync(struElementPath)) {
                switch (struElement.type) {
                    case ElementType.file:
                        this.toFix.push({
                            path: struElementPath,
                            type: "file",
                            problem: "not present in tree",
                            solution: "create it"
                        });
                        continue;
                    case ElementType.dir:
						if(createElement) {
							fs.mkdirSync(struElementPath);
							this.directoryCreated.push(struElementPath);
						} else {
							this.toFix.push({
								path: struElementPath,
								type: "folder",
								problem: "not present in tree",
								solution: "create it"
							});
						}
                        continue;
                    default:
                        this.toFix.push({
                            path: struElementPath,
                            type: "bho",
                            problem: "not present in tree",
                            solution: "create it"
                        });
                        continue;
                }


            }
        }

        const dirContents = fs.readdirSync(folderPath);
        dirContents.forEach(dirElementName => {
            // 0 - Preapare variables
            let dirElementPath = folderPath + "/" + dirElementName;

            // 1 - If exist in other
            if (structure[dirElementName] === undefined) {
                this.toFix.push({
                    path: dirElementPath,
                    problem: "not present in structure",
                    solution: "delete it"
                });
                return;
            }

            // 2 - If type is the same of other
            const stat = fs.lstatSync(dirElementPath);
            switch (structure[dirElementName].type) {
                case ElementType.file:
                    if (!stat.isFile()) {
                        this.toFix.push({
                            path: dirElementPath,
                            type: "folder",
                            problem: "invalid type! in structure is file but in reality is folder",
                            solution: "change type"
                        });
                        return;
                    }
                    break;
                case ElementType.dir:
                    if (!stat.isDirectory()) {
                        this.toFix.push({
                            path: dirElementPath,
                            type: "file",
                            problem: "invalid type! in structure is folder but in reality is file",
                            solution: "change type"
                        });
                        return;
                    }
                    break;
                default:
                    this.toFix.push({
                        path: dirElementPath,
                        type: "bho",
                        problem: "invalid file!",
                        solution: "delete it"
                    });
                    return;
            }

            if(stat.isDirectory()) {
                let childs = structure[dirElementName].child;
                if(childs !== undefined) {
                    this.work(dirElementPath, childs, createElement);
                }
            }

            this.verified.push(dirElementPath);
        });

    }

}