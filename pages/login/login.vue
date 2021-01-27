<template>
  <view class="content">
    <view class="header">
      <image src="../../static/shilu-login/logo.png"></image>
    </view>

    <view class="list">
      <view class="list-call">
        <image class="img" src="/static/shilu-login/1.png"></image>
        <input class="sl-input" v-model="user_name" type="text" maxlength="11" placeholder="输入账号" />
      </view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/2.png"></image>
        <input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="输入密码" password="true" />
      </view>

    </view>

    <view class="button-login" hover-class="button-hover" @tap="bindLogin()">
      <text>登录</text>
    </view>

    <view class="agreenment">
      <navigator url="forget" open-type="navigate">忘记密码</navigator>
      <text>|</text>
      <navigator url="reg" open-type="navigate">注册账户</navigator>
    </view>
	<view class="otherLoginWays">
	    <view class="otherWayTextWrapper">
	        <view class="otherWayText">其他登录方式</view>
	    </view>
		<!-- #ifndef MP-WEIXIN -->
		<view class="icons">
		    <slot name="otherLoginWays_icons">
		        <img class="icon" src="../../static/images/icon_QQ.png" @click="qqLogin">
		        <img class="icon" src="../../static/images/icon_weixin.png" @click="weixinLogin">
		        <img class="icon" src="../../static/images/icon_weibo.png" @click="weiboLogin">
		    </slot>
		</view>
		<!-- #endif -->
	    
	</view>
  </view>
</template>

<script>
	const apps=getApp().globalData.comm;
  export default {
    data() {
      return {
        user_name: '',
        password: ''
      };
    },
    methods: {
		qqLogin(){
			// #ifdef H5
			apps.tan('网页版暂不支持第三方登录')
			// #endif
		},
		bindLogin() {
			if(!this.user_name) {
			  apps.tan('账号不能为空',1000);return;
			}
			if(!this.password) {
			  apps.tan('密码不能为空',1000);return;
			}
			// if(this.user_name.length < 6) {
			//   apps.tan('账号小于6位！',1000);return;
			// }
			if(this.password.length < 6) {
			  apps.tan('密码小于6位！',1000);return;
			}
			var data={user_name:this.user_name,password:this.password};
			this.$request(apps.api.login,data).then(res => {
				apps.tan(res.msg,1000);
				if(res.code==200){
					uni.setStorageSync('input_info', res.data);
					setTimeout(()=>{
						uni.reLaunch({
							url:'../ge/index'
						})
					},1000)
				}
			})
		},
    }
  }
</script>

<style lang="less" scoped>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .header {
    width: 161rpx;
    height: 161rpx;
    background: rgba(63, 205, 235, 1);
    box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
    border-radius: 50%;
    margin-top: 30rpx;
    margin-left: auto;
    margin-right: auto;
  }

  .header image {
    width: 161rpx;
    height: 161rpx;
    border-radius: 50%;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

  .list-call {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    color: #333333;
    border-bottom: 0.5px solid #e2e2e2;
  }

  .list-call .img {
    width: 40rpx;
    height: 40rpx;
  }

  .list-call .sl-input {
    flex: 1;
    text-align: left;
    font-size: 32rpx;
    margin-left: 16rpx;
  }

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 470rpx;
    height: 100rpx;
    background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    line-height: 100rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
  }

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }

  .agreenment {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #FFA800;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }

  .agreenment text {
    font-size: 24rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
  }
  /*********************第三方登录******************/
  .otherLoginWays{
      width: 80%;
      position: absolute;
      bottom: 15.2%;
      left: 10%;
      right: 10%;
      text-align: center;
      .otherWayTextWrapper{
          line-height: 0;
          color: #666666;
          &:before,&:after{
              position: absolute;
              background: #cccccc;
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
          margin-top: 1.2em;
          img{
              width: 2.88rem;
              height: 2.88em;
          }
      }
  }
  
</style>
