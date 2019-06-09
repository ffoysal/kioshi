[
  {
    "name": "kioshi",
    "image": "ffoysal/kioshi:1.1.0",
    "cpu": ${container_cpu},
    "memory": ${container_memory},
    "networkMode": "awsvpc",
    "environment": [
        {
          "name": "MONGODB_URI",
          "value": "mongodb://${db_ip}:27017/mms-db"
        },
        {
          "name":"SWAGGER_URI",
          "value":"${swagger_uri}"
        }
    ],
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${log_group_name}",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "kioshi"
        }
    },
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 3000
      }
    ]
  }
]