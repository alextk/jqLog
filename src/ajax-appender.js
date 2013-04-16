(function($) {

  $.jqLog.classes.AjaxAppender = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.AjaxAppender.prototype, {

    url: null, //url to which logger statements will be posted
    flushSize: 100, //messages will be sent when buffer is full (has 100 messages)
    bufferLocked: false, //if buffer is locked after ajax request by slicing the buffer

    initialize: function(config) {
      if(!config.url) throw "config.url must be present in ajax appender config"
      $.extend(this, config);

      this.buffer = [];
      this.bufferLocked = false;
    },

    getLayouter: function(){
      return this.layouter || $.jqLog.rootLayouter();
    },

    doAppend: function(event){
      var msg = this.getLayouter().eventToString(event);
      this._safePushToBuffer(msg);
      if(this.buffer.length >= this.flushSize) this.flush();
      return true;
    },

    _safePushToBuffer: function(msg){
      var self = this;
      if(this.bufferLocked){
        window.setTimeout(5, function(){ self._safePushToBuffer(msg); });
      } else {
        this.buffer.push(msg);
      }
    },

    // send all messages in buffer to server
    flush: function(){
      var self = this;
      if(this.flushing) return;  //do not send multiple requests

      this.flushing = true;
      var messages = this.buffer.clone(); //we clone it since buffer might continue to fill up as we sending ajax request
      $.ajax({
        url: this.url,
        type: 'post',
        data: $.param({log_messages: messages}),
        success: function(){
          this.bufferLocked = true;
          try{
            self.buffer = self.buffer.slice(messages.length);
          }catch(e){
          }finally{
            this.bufferLocked = false;
          }
        },
        error: function(xhr){
        },
        complete: function(){
          self.flushing = false;
        }
      });
    }

  });

})(jQuery);
