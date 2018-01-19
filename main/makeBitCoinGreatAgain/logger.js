function getLogger() {
    return {
        error: function(message) {
            console.log(message)
        },        
        info: function(message) {
            console.log(message)
        }
    }
}
module.exports = getLogger;
