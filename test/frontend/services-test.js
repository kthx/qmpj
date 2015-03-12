describe('myQmpj services', function() {
    beforeEach(module('myQmpj.services'));

    it('should return current version', inject(function(version) {
        expect(version).toEqual('0.1');
    }));

    describe("lastResultService", function(){
        it('can set and get last result', inject(function(lastResultService) {
            lastResultService.setLastResult("FindMeLater");
            expect(lastResultService.getLastResult()).toEqual("FindMeLater");
        }));
    });

    describe("configService", function(){
        beforeEach(inject(function (_configService_, $httpBackend) {
            configService = _configService_;
            httpBackend = $httpBackend;
        }));
        it('getCurrentConfig loads the config into the service and returns true', function() {
            httpBackend.whenGET("/config/api").respond({
                    data: JSON.stringify({ key: 'findMe'})
            }); 

            configService.getCurrentConfig().then(function(result) {
                expect(result).toEqual(true);
                expect(
                    JSON.stringify(configService.currentConfig) 
                    == JSON.stringify({ key: 'findMe'})).toEqual(true);
            });
            httpBackend.flush(); 
        });
        it('getCurrentConfig returns false on error', function() {
            httpBackend.whenGET("/config/api").respond(500, 'error'); 

            configService.getCurrentConfig().then(function(result) {
                expect(result).toEqual(false);
                expect(
                    JSON.stringify(configService.currentConfig) 
                    == JSON.stringify({})).toEqual(true);
            });
            httpBackend.flush();
        });

        it('restoreRefaults returns true on success', function() {
            httpBackend.whenGET("/config/api/defaults").respond(200, "ok");

            configService.restoreRefaults().then(function(result) {
                expect(result).toEqual(true);
            });
            httpBackend.flush();
        });
        it('restoreRefaults returns false on error', function() {
            httpBackend.whenGET("/config/api/defaults").respond(500, 'error'); 

            configService.restoreRefaults().then(function(result) {
                expect(result).toEqual(false);
            });
            httpBackend.flush();
        });

        it('saveCurrentConfig returns true on success', function() {
            httpBackend.whenPOST("/config/api").respond(200, "ok");

            configService.saveCurrentConfig().then(function(result) {
                expect(result).toEqual(true);
            });
            httpBackend.flush();
        });
        it('saveCurrentConfig returns false on error', function() {
            httpBackend.whenPOST("/config/api").respond(500, 'error'); 

            configService.saveCurrentConfig().then(function(result) {
                expect(result).toEqual(false);
            });
            httpBackend.flush();
        });
        it('can set and get config', function() {
            httpBackend.whenGET("/config/api").respond({
                    data: JSON.stringify({ key: 'FindMeLater'})
            });
            configService.setCurrentConfig({key:"FindMeLater"});
            configService.getCurrentConfig();
            expect(
                    JSON.stringify(configService.currentConfig) 
                    == JSON.stringify({key:"FindMeLater"})
            ).toEqual(true);
           
        });
    });
});