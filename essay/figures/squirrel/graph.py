import numpy
import matplotlib.pyplot as pyplot

pyplot.figure(figsize=(20,10))

android1 = sum(numpy.loadtxt('./4to3.android.iperf.txt').reshape(30,2).transpose())/2
android2 = sum(numpy.loadtxt('./6to5.android.iperf.txt').reshape(30,2).transpose())/2
squirrel1 = sum(numpy.loadtxt('./4to3.squirrel.iperf.txt').reshape(30,2).transpose())/2
squirrel2 = sum(numpy.loadtxt('./6to5.squirrel.iperf.txt').reshape(30,2).transpose())/2

x = numpy.array(range(1,31))

def graph(data1, data2, name):
    pyplot.figure()
    pyplot.bar(x, data1, color='red')
    pyplot.bar(x, data2, color='blue', bottom=data1)
    pyplot.legend(['Node1 -> Node2', 'Node3 -> Node 4'])
    pyplot.xlabel('Time (second)')
    pyplot.ylabel('UDP Throughput (Mbps)')
    pyplot.xlim([0,32])
    pyplot.ylim([0,50])
    pyplot.savefig(name)

graph(android1, android2, 'android.pdf')
graph(squirrel1, squirrel2, 'squirrel.pdf')
