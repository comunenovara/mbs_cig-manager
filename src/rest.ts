import * as core from 'express-serve-static-core';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { MAIN_PATH } from './app';

const cors = require('cors');

export class Rest {
	private express: core.Express;

	constructor() {

		this.express = express();
		this.express.use(cors());
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: true }));

		this.express.use(express.static(process.cwd()+'/assets/'));

		this.express.options('*', cors());




		this.express.get(MAIN_PATH + "/api/test", async (req: Request, res: Response) => await this.test(req, res));


		this.express.get(MAIN_PATH + '/*', (req: any, res: any) => {
			res.sendFile(process.cwd()+"/assets/index.html")
		});

	}

	getExpress(): core.Express {
		return this.express;
	}

	private async test(req: Request, res: Response) {
		res.status(200).json({
            message: "hello api"
        });
	}

}