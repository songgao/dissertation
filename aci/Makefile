BUILD_MACHINE=rkt
BUILD_WORKSPACE=/home/vagrant/build-workspace/aci
RSYNC_FLAGS=--times --checksum --human-readable --progress --recursive
GOBUILD=cd bin; CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -tags netgo

.PHONY: bin-clean bin-update aci-clean acis clean

acis: songgao-dissertation-master.aci songgao-dissertation-worker.aci

clean: bin-clean aci-clean

aci-clean:
	rm -f songgao-dissertation-master.aci songgao-dissertation-worker.aci

songgao-dissertation-master.aci: bin/squirrel-master

songgao-dissertation-worker.aci: bin/squirrel-worker bin/truck-playback bin/squirrel-worker-wrapper

%.aci: %.aci.build
	ssh $(BUILD_MACHINE) "mkdir -p $(BUILD_WORKSPACE)"
	rsync $(RSYNC_FLAGS) . $(BUILD_MACHINE):$(BUILD_WORKSPACE)
	ssh $(BUILD_MACHINE) "cd $(BUILD_WORKSPACE) && ./$@.build"
	scp $(BUILD_MACHINE):$(BUILD_WORKSPACE)/$@ ./$@


bin-update: bin-clean bin/squirrel-worker bin/squirrel-master bin/truck-playback

bin-clean:
	rm -f bin/*

bin/squirrel-worker:
	$(GOBUILD) "github.com/squirrel-land/squirrel/squirrel-worker"

bin/squirrel-master:
	$(GOBUILD) "github.com/squirrel-land/squirrel/squirrel-master"

bin/truck-playback:
	$(GOBUILD) "gitlab.com/songgao/truck-playback"

bin/squirrel-worker-wrapper:
	echo '#!/bin/sh\n/bin/squirrel-worker &\nsleep 2\n$$@ 2>/workspace/stderr | tee /workspace/stdout\nsync\nsleep 2' > bin/squirrel-worker-wrapper
	chmod +x bin/squirrel-worker-wrapper

bin:
	mkdir -p bin
