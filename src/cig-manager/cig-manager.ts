import { Channel, Connection, connect } from "amqplib";
import { SYSTEM_STRUCTURE, SYSTEM_FOLDER_PATH, MAIN_FOLDER_PATH } from "../constants";
import { FileStructureTool } from "./file-structure-tools";
import * as fs from 'fs';
import * as fse from 'fs-extra';

export class CigManager {



	init() {
		let fileStructureTool: FileStructureTool = new FileStructureTool();
		fileStructureTool.prepareStructure(SYSTEM_FOLDER_PATH, SYSTEM_STRUCTURE);
		let toFix = fileStructureTool.folderCheck(SYSTEM_FOLDER_PATH, SYSTEM_STRUCTURE);
		if (toFix.length > 0) {
			console.warn("Elementi da sistemare: ", toFix);
		} else {
			console.log("Struttura corretta!");
		}

		this.connectToRabbit();
	}

	private channel: Channel | undefined;

	private async connectToRabbit() {
		const connection: Connection = await connect('amqp://user:passq@rabbit:5672');
		this.channel = await connection.createChannel();
		console.log("Connessione avviata");
	}

	async createCig(year: number, cig: string, description: string) {
		//CONTROLLI

		let result;

		//ESEGUO
		let yearFolderPath = MAIN_FOLDER_PATH + '/' + year;
		if (!fs.existsSync(yearFolderPath)) {
			// creo cartella anno se non esiste
			fs.mkdirSync(yearFolderPath);
		}

		// preparo le variabili
		let cigFolderPath;
		let cigFolderName;
		{
			let yearIndex = this.getCigIncremental(year);
			result = yearIndex;
			cigFolderName = yearIndex + "_" + cig + "_ " + description;
			cigFolderPath = yearFolderPath + "/" + cigFolderName;
		}

		// creo cartella 
		fs.mkdirSync(cigFolderPath);

		// incremento index
		this.addCigIncremental(year);

		// aggiungo contenuto a cartella
		fse.copySync(SYSTEM_FOLDER_PATH + "/modello/", cigFolderPath, { overwrite: true });

		// setto permessi alle cartelle
		let comands: any = "";
		for (let folder in SYSTEM_STRUCTURE.modello.child) {
			comands += `Get-Acl -Path 'R:\\Gestione CIG\\_sistema\\permessi\\' | Set-Acl -Path "R:\\Gestione CIG\\${year}\\${cigFolderName}\\${folder}\"\n`;
		}

		if(this.channel) {
			this.channel.publish('channel', 'default', Buffer.from(comands))
		}

		return result;
	}

	private getCigIncremental(year: number): number {
		let index: number = 0;
		{
			let indexYearPath = SYSTEM_FOLDER_PATH + '/index/' + year;
			if (!fs.existsSync(indexYearPath)) {
				fs.writeFileSync(indexYearPath, "1");
			}
			index = +fs.readFileSync(indexYearPath, { encoding: 'utf8', flag: 'r' });
		}
		return index;
	}

	private addCigIncremental(year: number): number {
		let index: number = 0;
		{
			let indexYearPath = SYSTEM_FOLDER_PATH + '/index/' + year;
			if (!fs.existsSync(indexYearPath)) {
				fs.writeFileSync(indexYearPath, "1");
			}
			index = +fs.readFileSync(indexYearPath, { encoding: 'utf8', flag: 'r' });
			let newIndex: number = index + 1;
			fs.writeFileSync(indexYearPath, newIndex + "");
		}
		return index;
	}

}