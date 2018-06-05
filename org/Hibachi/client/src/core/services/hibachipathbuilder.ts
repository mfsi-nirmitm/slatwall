/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
/*services return promises which can be handled uniquely based on success or failure by the controller*/
class HibachiPathBuilder{
    public baseURL:string;
    public basePartialsPath:string;
    public apiSubsystemName:string;

    //@ngInject
    constructor(){
        console.log("HibachiPathBuilder");
        console.log(this.baseURL);
        console.log(this.basePartialsPath);
        console.log(this.apiSubsystemName);
    }

    public setBaseURL = (baseURL:string):void=>{
        console.log("setBaseURL");
        console.log(baseURL);
        this.baseURL = baseURL;
    }

    public setBasePartialsPath = (basePartialsPath:string):void=>{
        console.log("setBasePartialsPath");
        this.basePartialsPath = basePartialsPath
    }

    public setApiSubsystemName = (apiSubsystemName:string):void=>{
        console.log("setApiSubsystemName");
        this.apiSubsystemName = apiSubsystemName
    }

    public buildPartialsPath=(componentsPath:string):string=>{
        if(angular.isDefined(this.baseURL) && angular.isDefined(this.basePartialsPath)){
            return (this.baseURL + this.basePartialsPath + componentsPath).replace("//","/");
         }else{
            throw('need to define baseURL and basePartialsPath in hibachiPathBuilder. Inject hibachiPathBuilder into module and configure it there');
        }
    }
}

export{
    HibachiPathBuilder
}
