.PHONY : wsm-bandwidth

default:
	echo !

0826: charts/0826-front-rp14-wsm-bandwidth-2d-cl-1-7.json charts/0826-back-rp14-wsm-bandwidth-2d-cl-1-7.json

charts/%-wsm-bandwidth-2d-cl-1-7.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl2/log/tx workspaces/%-ictl-cl3/log/tx workspaces/%-ictl-cl4/log/tx workspaces/%-ictl-cl5/log/tx workspaces/%-ictl-cl6/log/tx workspaces/%-ictl-cl7/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=2' 'ICTL CL=3' 'ICTL CL=4' 'ICTL CL=5' 'ICTL CL=6' 'ICTL CL=7' --paths $? --chart wsm-bandwidth-2d > $@


wsm-bandwidth : charts/0821-front-wsm-bandwidth-2d.json charts/0821-front-wsm-bandwidth-3d.json

charts/%-wsm-bandwidth-2d.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl4/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart wsm-bandwidth-2d > $@

charts/%-wsm-bandwidth-3d.json : workspaces/%-raw/log/tx workspaces/%-ictl-cl1/log/tx workspaces/%-ictl-cl4/log/tx
	../chart-utils/main.js --names 'Raw' 'Raw Compressed' 'ICTL CL=4' --paths $? --chart wsm-bandwidth-3d > $@

charts/% : charts

charts:
	mkdir -p charts

