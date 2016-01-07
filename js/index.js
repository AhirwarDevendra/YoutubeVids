$(document).ready(function()
    {
        document.addEventListener("deviceready",onDeviceReady,false);
    });

function onDeviceReady()
{
    console.log("Device Is Ready");

    $('#channelNameOptions').val(localStorage.getItem('channel')); 
    $('#maxResultOptions').val(localStorage.getItem('maxResult'));

    if(localStorage.channel == null || localStorage.channel == '')
    {
        $('#popupDialog').popup("open");
    }
    else
    {
        var channel = localStorage.getItem('channel');
    }

    getPlayList(channel);
    
    $(document).on('click','#vidlist li',function(){
        showVideo($(this).attr('videoId'));
    });

    $('#channelBtnOk').click(function(){
        var channel = $('#channelName').val();
        setChannel(channel); 
        getPlayList(channel);
    });


    $('#saveOptions').click(function()
        {
            saveOptions();
        });

    $('#clearChannel').click(function()
        {
            clearChannel();
        });

}

function getPlayList(channel)
{
    $('#vidlist').html('');
    $.get(
            "https://www.googleapis.com/youtube/v3/channels?part=contentDetails",
            {
                forUsername: channel,
                key: 'AIzaSyBSVo6NSf1B_24wrw5k-MSaFcr-SrPr48A'
            },
            function(data){
                $.each(data.items,function(i,item){
                    console.log(item);

                    playlistId = item.contentDetails.relatedPlaylists.uploads;
                    getVideos(playlistId,localStorage.getItem('maxResult'));
                });
            }
        );

}

function getVideos(playlistId,maxResults)
{
    $.get(
            "https://www.googleapis.com/youtube/v3/playlistItems",
            {
                part: 'snippet',
                maxResults: maxResults,
                playlistId: playlistId,
                key: 'AIzaSyBSVo6NSf1B_24wrw5k-MSaFcr-SrPr48A'
            },function(data){
                $.each(data.items,function(i,item){
                    id = item.snippet.resourceId.videoId;
                    title = item.snippet.title;
                    thumb = item.snippet.thumbnails.default.url;

                    $('#vidlist').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
                    $('#vidlist').listview('refresh');
                });
            }
        );
}

function showVideo(id)
{
    console.log('Video ID '+id);
    $('#logo').hide();

    var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
    $('#showvideos').html(output);

}

function setChannel(channel)
{
    localStorage.setItem('channel',channel);
    console.log("Set Channel Is"+channel );
}

function saveOptions()
{
    var channel = $('#channelNameOptions').val();
    setChannel(channel);

    var maxResults = $('#maxResultOptions').val();
    setMaxResult(maxResults);
    $('body').pagecontainer('change','#main');
    getPlayList(channel);
}
function setMaxResult(maxResults)
{
    localStorage.setItem('maxResult',maxResults);
}
