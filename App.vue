<script>
	import apps from 'commonality/app.js'
	export default {
		 globalData: {  
			comm: apps
		},
		onLaunch: function() {
			console.log('App Launch')
			apps.islogin();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
<style>
	/*每个页面公共css */
	page{
		/* height: 100%; */
	}
	.all-add{
		position: fixed;
		bottom: 110rpx;
		right: 10rpx;
		font-size: 20rpx;
		display: flex;
		justify-content: center;
		color: white;
		align-items: center;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.all-add image{
		width: 60rpx;
		height: 60rpx;
		position: relative;
		right: 2rpx;
	}
	.submit{
		margin-top: 100rpx;
	}
	.all_checkbox{
		/* float: right; */
		position: absolute;
		right: 0;
	}
</style>
