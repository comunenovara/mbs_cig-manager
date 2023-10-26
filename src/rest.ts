import * as core from 'express-serve-static-core';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { MAIN_PATH } from './app';
import { CigManager } from './cig-manager/cig-manager';

const cors = require('cors');

export class Rest {
	private express: core.Express;

	constructor() {
		this.express = express();
		this.mainConfig();
		this.appConfig();
		this.endConfig();
	}

	getExpress(): core.Express {
		return this.express;
	}

	private mainConfig() {
		this.express.use(cors());
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: true }));

		this.express.use(express.static(process.cwd() + '/assets/'));

		this.express.options('*', cors());
	}

	private endConfig() {
		this.express.get(MAIN_PATH + '/*', (req: any, res: any) => {
			res.sendFile(process.cwd() + "/assets/index.html")
		});
	}

	cigManager: CigManager = new CigManager();
	private appConfig() {
		this.cigManager.init();

		this.express.get(MAIN_PATH + "/api/test", async (req: Request, res: Response) => this.test(req, res));

		this.express.get(MAIN_PATH + "/create-cig", async (req: Request, res: Response) => this.createCig(req, res));
	}

	private async test(req: Request, res: Response) {
		try {
			res.status(200).json({
				message: "hello api"
			});
		} catch (e) {
			res.status(500).json({
				error: e
			});
		}

	}

	private async createCig(req: Request, res: Response) {
		try {
			if (
				req.query.year === undefined ||
				req.query.cig === undefined ||
				req.query.description === undefined
			) {
				res.status(422).json({
					message: "Invalid params"
				});
				return;
			}

			let year: number = +req.query.year;
			let cig: string = "" + req.query.cig;
			let description: string = "" + req.query.description;

			this.cigManager.createCig(year, cig, description);

			res.status(200).json({
				message: "hello api",
				year: year
			});
		} catch (e) {
			res.status(500).json({
				error: e
			});
		}
	}

}