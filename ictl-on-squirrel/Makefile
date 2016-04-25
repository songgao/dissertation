.PHONY : default 0821 0826 0826-hz10 0826-diff-cmp 0826-replicate8 0826-replicate14

default:
	echo !

0821 : charts/0821-front-frame-bandwidth-2d.json charts/0821-back-frame-bandwidth-2d.json charts/0821-front-delivery-ratio-2d.json charts/0821-back-delivery-ratio-2d.json

0826: charts/0826-front-rp14-frame-bandwidth-2d-cl-1-7.json charts/0826-back-rp14-frame-bandwidth-2d-cl-1-7.json charts/0826-front-rp14-delivery-ratio-2d-cl-1-7.json charts/0826-back-rp14-delivery-ratio-2d-cl-1-7.json

0826-hz10: charts/0826-front-rp14-hz10-frame-bandwidth-2d-cl-1-7.json charts/0826-back-rp14-hz10-frame-bandwidth-2d-cl-1-7.json charts/0826-front-rp14-hz10-delivery-ratio-2d-cl-1-7.json charts/0826-back-rp14-hz10-delivery-ratio-2d-cl-1-7.json

0826-diff-cmp: charts/0826-front-rp12-frame-bandwidth-2d-diff-cmp.json charts/0826-back-rp12-frame-bandwidth-2d-diff-cmp.json charts/0826-front-rp12-delivery-ratio-2d-diff-cmp.json charts/0826-back-rp12-delivery-ratio-2d-diff-cmp.json

0826-replicate8: charts/0826-back-rp12-delivery-ratio-2d-replicate8-1.json charts/0826-back-rp12-delivery-ratio-2d-replicate8-2.json charts/0826-back-rp12-delivery-ratio-2d-replicate8-3.json charts/0826-back-rp12-delivery-ratio-2d-replicate8-4.json charts/0826-back-rp12-delivery-ratio-2d-replicate8-5.json charts/0826-back-rp12-delivery-ratio-2d-replicate8-6.json charts/0826-back-rp12-delivery-ratio-2d-replicate8-7.json charts/0826-back-rp12-delivery-ratio-2d-replicate8-8.json

0826-replicate14: charts/0826-back-rp12-delivery-ratio-2d-replicate14-1.json charts/0826-back-rp12-frame-bandwidth-2d-replicate14-1.json

0826-replicate12: charts/0826-back-rp12-delivery-ratio-2d-replicate12-1.json charts/0826-back-rp12-frame-bandwidth-2d-replicate12-1.json

charts/0826-back-rp12-delivery-ratio-2d-replicate%-1.json: workspaces/0826-back-rp12-raw-replicate%-1/log/rx $(addsuffix -replicate%-1/log/rx,$(addprefix workspaces/0826-back-rp12-ictl-cl,$(shell seq 1 7)))
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=2' 'ICTL CL=3' 'ICTL CL=4' 'ICTL CL=5' 'ICTL CL=6' 'ICTL CL=7' --paths $? --chart delivery-ratio-2d > $@

charts/0826-back-rp12-frame-bandwidth-2d-replicate%-1.json: workspaces/0826-back-rp12-raw-replicate%-1/log/tx $(addsuffix -replicate%-1/log/tx,$(addprefix workspaces/0826-back-rp12-ictl-cl,$(shell seq 1 7)))
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=2' 'ICTL CL=3' 'ICTL CL=4' 'ICTL CL=5' 'ICTL CL=6' 'ICTL CL=7' --paths $? --chart frame-bandwidth-2d > $@

charts/0826-back-rp12-delivery-ratio-2d-%.json : workspaces/0826-back-rp12-raw-%/log/rx workspaces/0826-back-rp12-ictl-cl1-%/log/rx workspaces/0826-back-rp12-ictl-cl4-%/log/rx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart delivery-ratio-2d > $@

charts/%-frame-bandwidth-2d-diff-cmp.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl1-flate/log/tx workspaces/%-ictl-cl1-gzip/log/tx workspaces/%-ictl-cl1-lzw/log/tx workspaces/%-ictl-cl1-zlib/log/tx workspaces/%-ictl-cl4/log/tx workspaces/%-ictl-cl4-flate/log/tx workspaces/%-ictl-cl4-gzip/log/tx workspaces/%-ictl-cl4-lzw/log/tx workspaces/%-ictl-cl4-zlib/log/tx 
	../chart-utils/main.js --names 'Raw' 'Raw Compressed Auto' 'Raw Compressed Flate' 'Raw Compressed Gzip' 'Raw Compressed Lzw' 'Raw Compressed Zlib' 'ICTL Auto' 'ICTL Flate' 'ICTL Gzip' 'ICTL Lzw' 'ICTL Zlib' --paths $? --chart frame-bandwidth-2d > $@

charts/%-delivery-ratio-2d-diff-cmp.json : workspaces/%-raw/log/rx workspaces/%-ictl-cl1/log/rx workspaces/%-ictl-cl1-flate/log/rx workspaces/%-ictl-cl1-gzip/log/rx workspaces/%-ictl-cl1-lzw/log/rx workspaces/%-ictl-cl1-zlib/log/rx workspaces/%-ictl-cl4/log/rx workspaces/%-ictl-cl4-flate/log/rx workspaces/%-ictl-cl4-gzip/log/rx workspaces/%-ictl-cl4-lzw/log/rx workspaces/%-ictl-cl4-zlib/log/rx 
	../chart-utils/main.js --names 'Raw' 'Raw Compressed Auto' 'Raw Compressed Flate' 'Raw Compressed Gzip' 'Raw Compressed Lzw' 'Raw Compressed Zlib' 'ICTL Auto' 'ICTL Flate' 'ICTL Gzip' 'ICTL Lzw' 'ICTL Zlib' --paths $? --chart delivery-ratio-2d > $@

charts/%-frame-bandwidth-2d-cl-1-7.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl2/log/tx workspaces/%-ictl-cl3/log/tx workspaces/%-ictl-cl4/log/tx workspaces/%-ictl-cl5/log/tx workspaces/%-ictl-cl6/log/tx workspaces/%-ictl-cl7/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=2' 'ICTL CL=3' 'ICTL CL=4' 'ICTL CL=5' 'ICTL CL=6' 'ICTL CL=7' --paths $? --chart frame-bandwidth-2d > $@

charts/%-delivery-ratio-2d-cl-1-7.json : workspaces/%-raw/log/rx workspaces/%-ictl-cl1/log/rx workspaces/%-ictl-cl2/log/rx workspaces/%-ictl-cl3/log/rx workspaces/%-ictl-cl4/log/rx workspaces/%-ictl-cl5/log/rx workspaces/%-ictl-cl6/log/rx workspaces/%-ictl-cl7/log/rx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=2' 'ICTL CL=3' 'ICTL CL=4' 'ICTL CL=5' 'ICTL CL=6' 'ICTL CL=7' --paths $? --chart delivery-ratio-2d > $@

charts/%-frame-bandwidth-2d.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl4/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart frame-bandwidth-2d > $@

charts/%-delivery-ratio-2d.json : workspaces/%-raw/log/rx workspaces/%-ictl-cl1/log/rx workspaces/%-ictl-cl4/log/rx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart delivery-ratio-2d > $@

charts/%-frame-bandwidth-3d.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl4/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart frame-bandwidth-3d > $@

charts/% : charts

charts:
	mkdir -p charts

