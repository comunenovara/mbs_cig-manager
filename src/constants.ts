import { ElementType, Elements } from "./cig-manager/file-structure-tools";

export const MAIN_FOLDER_PATH = "/home/stefano/dev/project/novara/back/cig-manager/test";

export const SYSTEM_FOLDER_PATH = MAIN_FOLDER_PATH + "/_sistema";

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