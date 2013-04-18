(function($) {

  $.jqLog.classes.AjaxAppender = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend($.jqLog.classes.AjaxAppender.prototype, {

    url: null, //url to which logger statements will be posted
    flushSize: 100, //messages will be sent when buffer is full (has 100 messages)
    messagesPerRequestLimit: 1000, //max number of messages that will be sent in one request (in case there was no internet, and accumulated a lot of messages, don't send them at once, split the buffer)
    bufferLocked: false, //if buffer is locked after ajax request by slicing the buffer
    failedAjaxDisablePeriod: 5*60*1000, // wait period in which no ajax request will be tried if previous ajax failed

    initialize: function(config) {
      if(!config.url) throw "config.url must be present in ajax appender config"
      $.extend(this, config);

      this.buffer = [];
      this.pauseAjaxUntil = null; //if failed to send ajax request, wait until this time before sending again (to prevent flood of ajax requests)
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
        window.setTimeout(function(){ self._safePushToBuffer(msg); }, 5);
      } else {
        this.buffer.push(msg);
      }
    },

    // send all messages in buffer to server
    flush: function(){
      var self = this;
      if(this.flushing) return;  //do not send multiple requests
      if(this.pauseAjaxUntil && (new Date().getTime()) < this.pauseAjaxUntil) return;  //do not send multiple requests

      this.flushing = true;
      var messages = this.buffer.clone(); //we clone it since buffer might continue to fill up as we sending ajax request
      if(messages.length > this.messagesPerRequestLimit) messages = messages.slice(0, this.messagesPerRequestLimit); //trim messages array to max allowed messages size per request
      $.ajax({
        url: this.url,
        type: 'post',
        data: $.param({log_messages: messages}),
        success: function(){
          self.bufferLocked = true;
          try{
            self.buffer = self.buffer.slice(messages.length);
          }catch(e){
          }finally{
            self.bufferLocked = false;
            self.pauseAjaxUntil = null;
          }
        },
        error: function(xhr){
          self.pauseAjaxUntil = new Date().getTime() + self.failedAjaxDisablePeriod; //do not try to flush again for the next 5 minutes (it is timestamp)
        },
        complete: function(){
          self.flushing = false;
        }
      });
    }

  });

})(jQuery);
