$(function(){ //41 pcs

   $("#indexbox div:gt(0)").hide();

    setInterval(function(){
      $("#indexbox > div:first")
           .next()
           .fadeIn(1000)
           .end()
           .appendTo("#indexbox")
           .hide();
    }, 3000);

    $("body > div:gt(0)").hide();

    var nextPage = function(){
        $("body > div:first").fadeOut(500, function(){
          $(this).next()
                  .fadeIn(500)
                  .end()
                  .appendTo("body")
                  .hide();
        });
    };

    var img;
    document.getElementById("buttonHidden").onclick = function() {
      img = "url(img/" + imageIndex + ".jpg) no-repeat";
      nextPage();
      createBoard();
    };

    document.getElementById("startbutton").onclick = function() {

      nextPage();

    };



    $("#pics img").click(function(){
    document.getElementById("buttonHidden").style.display = "block";

     $(this).parent().find("img").css("transform", "none");

    this.style.transform = "translateY(-20PX)";


    imageIndex = $(this).index() + 1;

    });


    // game functions
    //
    //  initialize the game
    var tiles = [];
    var num = 0;
    const emptyTile = 0;
    var immovables = [];
    var movables = [];
    var solved = false;
    var shuffleAmount = 0;
    var moves = [];


    var topMargin = 5;
    for (var row = 0; row < 3; row++)
    {
        var leftMargin = 5;
        for (var column = 0; column < 3; column++)
        {
            tiles.push(
                {
                    btop: -row * 150,
                    bleft: -column * 250,
                    data: num,
                    move:
                    {
                        left: column * 250 + leftMargin,
                        top: row * 150 + topMargin,
                        row: row,
                        col: column,
                        current: num++
                    }
                });
            leftMargin += 5;
        }
        topMargin += 5;
    }

    var createBoard = function ()
    {

      var ul = $("ul").empty();

        for (var i = 1; i < tiles.length; i++)
        {
          var lis = $("<li id='" + tiles[i].data + "'>");

            lis.css(
                {
                    "background": img,
                    "background-position": (tiles[i].bleft + "px " + tiles[i].btop + "px"),
                    "top": tiles[i].move.top + "px ",
                    "left": + tiles[i].move.left + "px"
                });
            lis.addClass("correct");
            ul.append(lis);
        }
    };

    var getImmovables = function ()
    {
        immovables = [];
        movables = [];
        var correctTiles = 0;
        for (var i = 0; i < tiles.length; i++)
        {
            if (Math.abs(tiles[i].move.row - tiles[emptyTile].move.row) + Math.abs(tiles[i].move.col - tiles[emptyTile].move.col) !== 1)
                immovables.push(tiles[i].data);
            else
                movables.push(tiles[i].move.current);

            if (tiles[i].data === tiles[i].move.current)
                correctTiles++;
        }

        if (correctTiles === 9)
            solved = true;
        else
            solved = false;
    };

    var isMovable = function (index)
    {
        return movables.includes(tiles[index].move.current);
    };

    var changeOpacity = function (opacity)
    {
        immovables.forEach(function (item)
        {


        });
    };

    getImmovables();

    $("#game ul").on('click', 'li', function ()
    {
        index = $(this).index() + 1;
        shiftTiles(index);
    });


    var resetGame = function()
    {
        solved = true;
        $("#game li").show();

        document.getElementById("game").style.background = "";
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("select").style.display = "block";

      };

    var shiftTiles = function (pressed)
    {
        if (!solved)
        {
            if (isMovable(pressed))
            {
                $("#" + pressed).finish().animate(
                {
                    "top": tiles[emptyTile].move.top,
                    "left": tiles[emptyTile].move.left
                }, 500, function()
                {
                    if (solved)
                    {
                        document.getElementById("select").style.display = "none";
                        $("#solveNow").hide();
                        document.getElementById("game").style.background = img;
                        $("#game li").fadeOut(2000);
                        $(".backdrop").fadeIn(2000);

                    }
                });

                var temp = tiles[pressed].move;
                tiles[pressed].move = tiles[emptyTile].move;
                tiles[emptyTile].move = temp;

                setClass(pressed);
                changeOpacity(1);
                getImmovables();
                changeOpacity(0.5);
            }
        }
    };

    var setClass = function(index)
    {
        var li = $("#" + tiles[index].data).removeClass();
        if (tiles[index].data === tiles[index].move.current)
            li.addClass("correct");
        else
            li.addClass("incorrect");
    };

    var shufflePuzzle = function()
    {
        var i = -1;

        var move = function(delay)
        {
            if (shuffleAmount -- > 0)
            {
                var j;

                do
                {
                    j = Math.floor(Math.random()*tiles.length);
                } while (i === j || !isMovable(j));

                i = j;

                if (isMovable(i))
                {
                    $("#" + i).animate(
                    {
                        "top": tiles[emptyTile].move.top,
                        "left": tiles[emptyTile].move.left
                    }, delay, function()
                    {
                        var temp = tiles[i].move;
                        tiles[i].move = tiles[emptyTile].move;
                        tiles[emptyTile].move = temp;

                        getImmovables();
                        setClass(i);
                        moves.push(i);
                        move(delay);
                      });
                }
              }
        };
        move(800 - shuffleAmount * 20);
    };



     //  select shuffle
     $("#shuffle").selectmenu(
     {
         change: function()
         {
             shuffleAmount = Number.parseInt(this.value);
             $("#play").removeClass("hideButton");
         }
     });

    $("body").keydown(function(e)
    {


        if (e.which === 116) //&& shuffleAmount > 0)
        {
            resetGame();
            e.preventDefault();
        }
        else if (e.which === 27)
        {
            solve();

            if (!solved)
                e.preventDefault();
        }
    });


    document.getElementById("play").onclick = function() {
      if (solved)
          {
            // document.getElementById("select").style.display = "none";
              $("#select").hide();
              shufflePuzzle();
              solved = false;
          }
    };


});
