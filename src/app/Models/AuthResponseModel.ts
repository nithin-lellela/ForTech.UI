export class ResponseModel{
    public ResponseCode: ResponseCode = ResponseCode.NotSet;
    public ResponseMessage: string = "";
    public DataSet: any;
}

export enum ResponseCode{
    NotSet = 0,
    Ok = 1,
    Error = 2
}
