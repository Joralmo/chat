<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>Chat Online</title>
	<link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
	<style>
		.list-group{
			overflow-y: scroll;
			height: 200px; 
		}
	</style>
</head>
<body>
	
	<div class="container">
		<div class="row" id="app">
			<div class="offset-4 col-4 offset-sm-1 col-sm-10">
				<li class="list-group-item active">Chat Room <span class="badge badge-pill badge-danger">@{{ numeroDeUsuarios }}</span></li>
				<div class="badge badge-pill badge-primary">@{{ escribiendo }}</div>
				<ul class="list-group" v-chat-scroll>
					<message v-for="value,index in chat.messages" :key=value.index :color=chat.color[index] :user = chat.user[index] :time = chat.time[index]>
						@{{ value }}
					</message>
				</ul>
				<input type="" name="" class="from-control col-12" placeholder="Escriba su mensaje" v-model='message' @keyup.enter='send'>
				<br><br><br>
				<center><a href="" class="btn btn-danger btn-sm" @click.prevent='deleteSession'>Borrar chat</a></center>
			</div>
		</div>
	</div>
	<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>