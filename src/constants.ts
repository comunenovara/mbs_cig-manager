import { ElementType, Elements } from "./cig-manager/file-structure-tools";

let rabbitServer = "rabbit:5672";
if (process.env.RABBIT_SERVER !== undefined) {
	rabbitServer = process.env.RABBIT_SERVER;
}
export const RABBIT_SERVER = rabbitServer;

let rabbitUsername = "user";
if (process.env.RABBIT_USER !== undefined) {
	rabbitUsername = process.env.RABBIT_USER;
}
export const RABBIT_USER = rabbitUsername;

let rabbitPassword = "pass";
if (process.env.RABBIT_PASSWORD !== undefined) {
	rabbitPassword = process.env.RABBIT_PASSWORD;
}
export const RABBIT_PASSWORD = rabbitPassword;







let mainFolderPath = "/home/stefano/dev/project/novara/mbs/back/cig-manager/test";
if (process.env.MAIN_FOLDER_PATH !== undefined) {
	mainFolderPath = process.env.MAIN_FOLDER_PATH;
}
export const MAIN_FOLDER_PATH = mainFolderPath;

let systemFolderPath = MAIN_FOLDER_PATH + "/_sistema";
if (process.env.SYSTEM_FOLDER_PATH !== undefined) {
	systemFolderPath = process.env.SYSTEM_FOLDER_PATH;
}
export const SYSTEM_FOLDER_PATH = systemFolderPath;

export const SYSTEM_STRUCTURE: Elements = {
	"index": {
		type: ElementType.dir
	},
	"modello": {
		type: ElementType.dir,
		child: {
			"1_ Avvio procedura": {
				type: ElementType.dir
			},
			"2_ Gara": {
				type: ElementType.dir
			},
			"3_ Verifiche": {
				type: ElementType.dir
			},
			"4_ Aggiudicazione": {
				type: ElementType.dir
			},
			"5_ Contratto": {
				type: ElementType.dir
			},
			"6_ Corso d'opera": {
				type: ElementType.dir
			},
			"7_ Pagamenti": {
				type: ElementType.dir
			},
			"8_ Rendicontazione": {
				type: ElementType.dir
			}
		}
	}
};