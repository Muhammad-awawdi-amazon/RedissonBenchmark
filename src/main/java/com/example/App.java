package com.example;

import java.util.Map;

import org.redisson.Redisson;
import org.redisson.api.ClusterNode;
import org.redisson.api.Node.InfoSection;  // <-- Import this
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class App {
    public static void main(String[] args) {
        try {
            // Load Redisson configuration from JSON
            Config config = Config.fromJSON(App.class.getResource("/redisson.json"));
            RedissonClient redisson = Redisson.create(config);

            // Iterate over cluster nodes
            for (ClusterNode node : redisson.getClusterNodesGroup().getNodes()) {
                System.out.println("Node address: " + node.getAddr());

                // Fetch CLIENTS info
                Map<String, String> clientsInfo = node.info(InfoSection.CLIENTS);
                System.out.println("Connected clients: " + clientsInfo.get("connected_clients"));
            }

            // Example usage: Set/get a key
            String testKey = "myTestKey";
            redisson.getBucket(testKey).set("Hello, Valkey!");
            String value = (String) redisson.getBucket(testKey).get();
            System.out.println("Value of " + testKey + " = " + value);

            redisson.shutdown();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
