<html>
<head>
    @if(app('env')=='local')
      <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    @endif
    @if(app('env')=='production')
      <link rel="stylesheet" href="{{ secure_asset('css/app.css') }}">
    @endif
</head>
<body>
  <input type="hidden" id="client_id" value="{{ $clientId }}">
  <h3 class="title"></h3>
    <div class="items">
      <div id='calendar1' class="item" ></div>
      <div id='calendar2' class="item" ></div>
      <div id='calendar3' class="item" ></div>
      <div id='calendar4' class="item" ></div>
      <div id='calendar5' class="item" ></div>
      <div id='calendar6' class="item" ></div>
      <div id='calendar7' class="item" ></div>
      <div id='calendar8' class="item" ></div>
      <div id='calendar9' class="item" ></div>
      <div id='calendar10' class="item" ></div>
      <div id='calendar11' class="item" ></div>
      <div id='calendar12' class="item" ></div>
    </div>
    <div class="text">
      <p id='memo'></p>

      <div class="text-left">
        <p><img class="fit-picture" src="logo.svg" alt="" height="200" width="200"></p>
      </div>
      <div class="text-right">
        <h2>株 式 会 社 ク ラ イ ズ</h2>
        <p>埼玉県北本市中丸7-153</p>
        <p>TEL　０４８ー５０１ー７６５３</p>
        <p>ﾌﾘｰﾀﾞｲｱﾙ　０１２０ー２１２１ー７４</p>
      </div>
    </div>
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>