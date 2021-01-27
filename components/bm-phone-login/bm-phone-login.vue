<template>
    <view class="phoneLogin">
        <slot name="header">
            <h2>手机登录</h2>
        </slot>
        <view class="input_wrapper">
            <view class="inputItem" :class="{'focus':isFocus.phoneNum,'phone_empty':errorFlag.phone_empty,'phone_error':errorFlag.phone_err}">
                <span class="chooseArea">+86</span>
                <view class="inputContent">
                    <input type="text" @focus="focus('phoneNum')" @blur="blur('phoneNum')" placeholder="请输入手机号" @input="inputPhone" maxlength="11" auto-focus>
                </view>
            </view>
            <view class="inputItem codeInput" :class="{'focus':isFocus.code,'code_empty':errorFlag.code_empty,'code_error':errorFlag.code_err}">
                <view class="inputContent ">
                    <input id="input_code" @focus="focus('code')" @blur="blur('code')" @input="activeLogin" placeholder="请输入验证码" :maxlength="mConfigs.code_length">
                </view>
                <view class="getCodeBtn">
                    <button @click="getVerifyCode()" :class="{'code-active':!getCodeDisabled,'code-forbidden':getCodeDisabled}" :disabled="getCodeDisabled">
						{{getCodeBtnText}}
					</button>
                </view>
            </view>
        </view>
        <view>
            <button :class="{'opt_button':!isLoginForbidden,'forbidden':isLoginForbidden}" class="loginBtn" :disabled="isLoginForbidden" @click="login()">
                {{mConfigs.login_btn_value}}
            </button>
        </view>
        <button v-if="mConfigs.accountLogin" class="accountLogin" @click="$emit('accountLogin')">
            用账号密码登录
        </button>
        <view class="tips">
            <view v-if="mConfigs.changedPhone" class="changedPhone" @click="$emit('changedPhone')">
                手机号已更换
            </view>
        </view>
        <view class="otherLoginWays" v-if="mConfigs.otherLoginWays" v-show="hideFooter">
            <view class="otherWayTextWrapper">
                <view class="otherWayText">其他登录方式</view>
            </view>
            <view class="icons">
                <slot name="otherLoginWays_icons">
                    <img class="icon" src="../../static/images/icon_QQ.png" @click="$emit('qq_login')" alt="qqLogin">
                    <img class="icon" src="../../static/images/icon_weixin.png" @click="$emit('weixin_login')" alt="weixinLogin">
                    <img class="icon" src="../../static/images/icon_weibo.png" @click="$emit('weibo_login')" alt="weiboLogin">
                </slot>
            </view>
        </view>

        <view class="protocol" v-if="mConfigs.protocol" v-show="hideFooter">
            登录注册即代表阅读并同意<span @click="$emit('toProtocol')">用户服务协议</span>
        </view>

    </view>
</template>

<script>
    export default {
        name: "bm_phone_login",
		props:['baseConfig'],
        data(){
            return{
                //用户输入信息
                input_info:{
                    phone:"",
                    code:"",
                },
                //倒计时
                countDownTime:60,
                timeOut:true,
                timer:null,
                //聚焦（切换样式）
                isFocus:{
                    phoneNum:false,
                    code:false
                },
                //错误信息
                errorFlag:{
                    phone_empty:false,
                    phone_err:false,
                    code_empty:false,
                    code_err:false
                },
                //登录按钮禁用
                isLoginForbidden:true,
                // 获取验证码按钮禁用
                getCodeDisabled: true,
                // 获取验证码按钮文字
                getCodeBtnText: "获取验证码",
                //解决安卓输入框将fixed布局顶上的问题
                hideFooter:true,
                docmHeight: document.documentElement.clientHeight || document.body.clientHeight,
                showHeight: document.documentElement.clientHeight || document.body.clientHeight,
            }
        },

        watch: {
            //监听显示高度
            showHeight:function() {
                this.hideFooter = this.docmHeight <= this.showHeight;
            }
        },

        computed:{
            //合并父组件的传入值与默认值
            mConfigs(){
                return Object.assign({
                    accountLogin:true,
                    changedPhone: true,
                    protocol: true,
                    otherLoginWays: true,
                    code_length:4,
                    login_btn_value:'登录'
                },this.baseConfig)
            }
        },

        mounted() {
            //监听事件
            window.onresize = ()=>{
                return(()=>{
                    this.showHeight = document.documentElement.clientHeight || document.body.clientHeight;
                })()
            }
        },

        methods:{
            inputPhone(e){
				let phone = e.detail.value;
                //输入手机号
                let value = phone.replace(/\D/g, '').substr(0, 11); // 不允许输入非数字字符，超过11位数字截取前11位
                let len = value.length;
                //判空
                this.errorFlag.phone_empty = phone === "" || phone === null || phone === undefined;
                //判断手机号格式是否正确
				let regExp = /^1[3456789]\d{9}$/;
                this.errorFlag.phone_err = !(regExp.test(value)) && !this.errorFlag.phone_empty;
				if (len === 11) {
					if (!(this.errorFlag.phone_empty || this.errorFlag.phone_err) && this.timeOut) {
						//激活获取验证码按钮
						this.getCodeDisabled = false;
					} else {
						this.getCodeDisabled = true;
					}
				} else {
					this.getCodeDisabled = true;
				}
                this.input_info.phone = value;
            },
			// 输入验证码
			activeLogin(e){
			    //判空
				let code = e.detail.value;
			    this.input_info.code = code;
			    this.errorFlag.code_empty = code === "" || code === null || code === undefined;
			    if (code && code.length === this.mConfigs.code_length) {
			        //激活登录按钮
			        this.isLoginForbidden = this.errorFlag.phone_empty || this.errorFlag.phone_err || this.errorFlag.code_empty;
			    }
			},
            focus(type){
                this.isLoginForbidden = true;
                if (type === "phoneNum"){
                    this.isFocus.phoneNum = true;
                    this.errorFlag.phone_empty = false;
                } if (type === "code"){
                    this.isFocus.code = true;
                    this.errorFlag.code_empty = false;
                }
            },
            blur(type) {
                if (type === "phoneNum") {
                    this.isFocus.phoneNum = false;
                }
                if (type === "code") {
                    this.isFocus.code = false;
                }
            },
			// 获取验证码
            getVerifyCode(){
                let that = this;
                let input_phone = this.input_info.phone.replace(/\s*/g,"");      //去除空格
                this.$emit('parent_get_code',input_phone);
                this.timeOut = false;
                //倒计时
                if (!this.errorFlag.phone_err && !this.errorFlag.phone_empty){
                    uni.showToast({
                        title: '验证码已发送',
                        position: 'center',
                    });
                    this.timer = setInterval(()=>{
                        that.countDownTime--;
                        // that.getCodeBtnText = this.countDownTime + "s后重新获取";
                        that.getCodeBtnText = this.countDownTime + "秒";
                        that.getCodeDisabled = true;
                        if(that.countDownTime <= 0){
                            clearInterval(this.timer);
                            that.countDownTime = 60;
                            that.timeOut = true;
                            that.getCodeDisabled = false;
                            that.getCodeBtnText = "获取验证码";
                        }
                    },1000)
                } else {
                    that.errorFlag.phone_empty = true;
                }
            },
            //登录
            login(){
                if (!this.isLoginForbidden){
                    //去除空格
                    this.input_info.phone = this.input_info.phone.replace(/\s*/g,"");
                    //用户设置函数
                    this.$emit('parent_phone_login',this.input_info);
                }
            }
        },
        beforeDestroy(){
            clearInterval(this.timer);
            this.timer = null;
        },
    }
</script>

<style lang="less" scoped>
    @mainColor: #007cdc;
    .gradient{
        background-image: linear-gradient(to right,@mainColor,lighten(@mainColor,18%));
    }
    .error{
        background: red;
        transform: scaleY(1);
        font-size: .72rem;
        color: red;
        text-align: right;
        line-height: 1.6rem;
    }
    .phoneLogin{
        width: 80%;
        margin: 0 auto;
		padding-top: 33%;
        text-align: center;
        h2{
            color: #666666;
            font-size: 1.6rem;
        }
        //用户名、密码输入框
        .input_wrapper{
            .inputItem{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                position: relative;
                margin-top: 1.42rem;
                &::after{
                    content: "";
                    position: absolute;
                    height: 1px;
                    width: 100%;
                    bottom: 0;
                    transform: scaleY(.5);
                    background: #bfbfbf;
                }
                .chooseArea{
                    display: flex;
                    align-items: center;
                    span{
                        margin-left: .2rem;
                        margin-top: 7.2%;
                    }
                }

                .inputContent{
                    padding: .4rem;
                    input{
                        border: none;
                        outline: none;
                        width: 80%;
                        letter-spacing: .1rem;
                        &::placeholder{
                            color: #aaaaaa;
                        }
                    }
                    #input_code{
                        text-align: center;
                        letter-spacing: .1rem;
                    }
                }
				.codeInput {
					display: flex;
					flex-direction: row;
				}
                .getCodeBtn{
					button {
						letter-spacing: 0;
						font-size: .68rem;
						border-radius: 6px;
						margin-bottom: .4rem;
						text-indent: 0;
						padding-left: .2rem;
						padding-right: .2rem;
					}
                    .code-active {
                        background: white;
                        color: @mainColor;
                        border: .5px @mainColor solid;
                        &:active{
                            background: #f1f1f1;
                        }
                    }
					.code-forbidden {
						background: tint(@mainColor,90%);
						color: fade(@mainColor,40%);
						border: #f2f2f2;
					}
                }
				
				
            }
            .focus::after{
                background: @mainColor;
            }
            .phone_empty::after{
                content: '手机号不能为空';
                .error();
            }
            .phone_error::after{
                content: '请填入正确的手机号';
                .error();
            }
            .code_empty::after{
                content: '验证码不能为空';
                .error();
            }
            .code_error::after{
                content: '验证码错误';
                .error();
            }
        }
        //登录按钮
        button{
           .gradient;
           border: none;
           outline: none;
           width: 100%;
           position: relative;
           color: white;
           border-radius: 1.2rem;
           overflow: hidden;
           letter-spacing: .6rem;
           text-indent: .6rem;
           text-align: center;
           outline: 0;
        }
        .loginBtn {
            width: 100%;
			margin-top: 1.6rem;
        }
        //账号密码登录
        .accountLogin{
            width: 100%;
            letter-spacing: .1rem;
            background: white;
            border: .8px solid @mainColor;
            color: @mainColor;
            margin-top: 5%;
            &:active{
                background: fade(@mainColor,8%);
            }
        }
        .opt_button{
            cursor: pointer;
            &::after{
                content: "";
                background: #fff;
                display: block;
                position: absolute;
                width: 200%;
                height: 200%;
                top: -5%;
                border-radius: 50px;
                margin-left: -80%;
                opacity: 0;
                transition: all 0.75s ease-in-out;
            }
            &:active::after {
                width: 0;
                opacity: 0.6;
                transition: 0s;
            }
        }
        .forbidden{
            background: tint(@mainColor,70%);
            color: fade(white,80%);
        }

        .tips{
            font-size: .8rem;
            margin-top: .4rem;
            text-align: right;
            .changedPhone{
                margin-right: .2rem;
                color: #2986de;
            }
        }

        /*********************第三方登录******************/
        .otherLoginWays{
            width: 80%;
            position: fixed;
            bottom: 8.2%;
            left: 10%;
            right: 10%;
            text-align: center;
            .otherWayTextWrapper{
                line-height: 0;
                &:before,&:after{
                    position: absolute;
                    background: #ddd;
                    content: "";
                    height: 1px;
                    width: 30%;
                }
                &:before{
                    left: 0;
                }
                &:after{
                    right: 0;
                }
                .otherWayText{
                    font-size: .8rem;
                    color: #bbbbbb;
                }
            }
            .icons{
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                margin-top: 1.4em;
                img{
                    width: 2rem;
                    height: 2em;
                }
            }
        }

        .protocol{
            position: fixed;
            bottom: 4%;
            left: 2%;
            right: 2%;
            font-size: .72em;
            margin-top: 8%;
            color: #333333;
            span{
                color: #2986de;
            }
        }
    }
</style>
