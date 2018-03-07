export enum ERROR_CODE {
    SUCCESS	                       =    0   ,  //成功
    SESSION_EXPIRED	               = 41001	,  //会话无效或已过期（ 需要重新登录）
    SERVICE_CEILING	               = 41002	,  //达到服务上限
    ILLEGAL_DATAFORMAT	           = 41003	,  //不合法数据格式
    INVALID_METHOD	               = 42001	,  //无效的方法
    INVALID_PARAMS	               = 42002	,  //无效的参数
    INVALID_TOKEN	               = 42003	,  //无效的令牌
    INVALID_TRANSACTION	           = 43001	,  //无效的交易
    INVALID_ASSET	               = 43002	,  //无效的资产
    INVALID_BLOCK	               = 43003	,  //无效的块
    UNKNOWN_TRANSACTION	           = 44001	,  //找不到交易
    UNKNOWN_ASSET	               = 44002	,  //找不到资产
    UNKNOWN_BLOCK	               = 44003	,  //找不到块
    INVALID_VERSION	               = 45001	,  //协议版本错误
    INTERNAL_ERROR	               = 45002	,  //内部错误
    NETWORK_ERROR	               = 60000	,  //网络错误
    DB_OP_ERROR	                   = 60001	,  //数据库操作错误
    NO_BALANCE	                   = 60002	,  //余额不足
    Decrypto_ERROR	               = 60003	,  //解密错误
    Encrypto_ERROR	               = 60004	,  //加密错误
    Deserialize_BLOCK_ERROR	       = 60005	,  //反序列化Block错误
    Deserialize_TRANSACTION_ERROR  = 60006	,  //反序列化Transaction错误
    ComposeIssTransaction_ERROR	   = 60007	,  //组合交易Iss错误
    ComposeTrfTransaction_ERROR	   = 60008	,  //组合交易Trf错误
    Signature_INCOMPLETE	       = 60009	,  //签名未完成
    IllegalArgument	               = 60011	,  //不合法参数
    IllegalAddress	               = 60012	,  //不合法地址
    IllegalAssetId	               = 60013	,  //不合法资产编号
    IllegalAmount	               = 60014	,  //不合法数值
    IllegalTxid	                   = 60015	,  //不合法交易编号

    UNKNOWN_ONTID                  = 70000  ,  //不存在的ONT ID
}
