<template>
    <view class="phone_login">
        <bm-phone-login v-on:accountLogin="to_account_login"
                       v-on:changedPhone="to_change_phone"
                       v-on:qq_login="qqLogin"
                       v-on:weixin_login="weixinLogin"
                       v-on:weibo_login="weiboLogin"
                       @parent_choose_area="to_chooseArea"
                       @parent_get_code="getCode"
                       @parent_phone_login="phoneLogin"
                       :base-config="myConfig">
            <template v-slot:header>
                <view style="display: flex;flex-direction: row;justify-content: space-around;align-items: center">
                    <h2>Welcome To PhoneLogin</h2>
                </view>
            </template>
        </bm-phone-login>
    </view>
</template>

<script>
	import bmPhoneLogin from '../../components/bm-phone-login/bm-phone-login.vue'
    export default {
        name: "phone_login",
		components: {
			bmPhoneLogin
		},
        data(){
            return{
                countryTel:"",
                myConfig: {
                    code_length:4,
                    accountLogin:true,
                    changedPhone: true,
                    protocol: true,
                    otherLoginWays: true,
                    //登录按钮中的内容
                    login_btn_value: '登录'
                }
            }
        },
        methods:{
            to_account_login(){
                // 跳转到账号密码登录页面
				uni.navigateTo({
					url: '../login/index'
				})
            },
            to_change_phone(){
                //跳转到更改手机号页面
            },
            getCode(tel){
                //获取验证码
                console.log("tel:"+tel);//用户输入的手机号
            },
            phoneLogin(inputInfo){
                //登录
                console.log(inputInfo);//用户输入的手机号及验证码
            },
            qqLogin(){},
            weixinLogin(){},
            weiboLogin(){}
        }
    }
</script>

<style scoped>

</style>
