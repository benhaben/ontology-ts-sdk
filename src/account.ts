import * as core from './core'
import * as scrypt from './scrypt'
import { ab2hexstring, hexstring2ab } from './utils'
import {DEFAULT_ALGORITHM, Algorithm} from './consts'
import {ERROR_CODE} from './error'
export class Contract {
    script : string
    parameters : Array<string>
    deployed : boolean
}

export class Account {
    address: string;
    label: string;
    isDefault: boolean;
    lock: boolean;
    algorithm: string;
    parameters: {};
    key: string;
    contract: Contract
    extra: null;

    constructor() {
    }

    create( privateKey: string, password: string, label: string, algorithmObj ?: any ): Account {
        
        let contract = {
            script : '',
            parameters : [],
            deployed : false
        }

        this.address = "";
        this.label = label;
        this.isDefault = false;
        this.lock = false;

        if(algorithmObj) {
            this.algorithm = algorithmObj.algorithm
            this.parameters = algorithmObj.parameters
        } else {
            this.algorithm = DEFAULT_ALGORITHM.algorithm
            this.parameters = DEFAULT_ALGORITHM.parameters
        }
        
        this.key = scrypt.encrypt( privateKey, password );

        let publicKeyEncoded = ab2hexstring( core.getPublicKey( privateKey, true ) );
        contract.script = core.createSignatureScript( publicKeyEncoded );
        this.contract = contract 

        let programHash = core.getHash( this.contract.script );
        this.address = core.toAddress( programHash );

        return this;
    }



    static importAccount(accountDataStr : string ,encryptedPrivateKey : string, password : string ) : Account {
        let account = new Account()
        let  privateKey = scrypt.decrypt(encryptedPrivateKey, password);
                
    
        return Account.parseJson(accountDataStr)
    }

    toJson() : string {
        let obj = {
            address: this.address,
            label: this.label,
            isDefault: this.isDefault,
            lock: this.lock,
            algorithm: this.algorithm,
            parameters: this.parameters,
            key: this.key,
            contract: this.contract,
            extra: this.extra
        }
        return JSON.stringify(obj)
    }

    static parseJson( json : string ) : Account {
        let obj = JSON.parse(json)
        let account = new Account()
        account.address = obj.address
        account.label = obj.label
        account.isDefault = obj.isDefault
        account.lock = obj.lock
        account.algorithm = obj.algorithm
        account.parameters = obj.parameters
        account.key = obj.key
        account.contract = obj.contract
        account.extra = obj.extra
        return account;
    }

}

