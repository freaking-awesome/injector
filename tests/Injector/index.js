var Injector= require('../..')

var noop= function () {}



describe('injector', function () {



    describe('#set', function () {

        it('should define dependency', function () {
            var injector= Injector()
            injector.set('A', 'a')
            console.assert(injector.get('A') == 'a')
        })

        it('should be chainable', function () {
            var injector= Injector()
            console.assert(injector.set('A') === injector)
        })

    })

    describe('#get', function () {

        it('should return dependency', function () {
            var injector= Injector()
            injector.set('A', 'a')
            console.assert(injector.get('A') == 'a')
        })

        it('should throw error if dependency undefined', function (done) {
            try {
                var injector= Injector()
                injector.get('A')
            } catch (err) {
                console.assert(err.message == 'dependency undefined: A')
                done()
            }
        })

    })

    describe('#has', function () {

        it('should return `true` if dependency exists', function () {
            var injector= Injector()
            injector.set('A', 'a')
            console.assert(injector.has('A') === true)
        })

        it('should return `false` if dependency exists', function () {
            var injector= Injector()
            console.assert(injector.has('A') === false)
        })

    })

})
