helm upgrade --install auth ./helm/auth
helm upgrade --install auth-mongo ./helm/auth-mongo
helm upgrade --install client ./helm/client
helm upgrade --install expiration ./helm/expiration
helm upgrade --install expiration-redis ./helm/expiration-redis
helm upgrade --install ingress ./helm/ingress
helm upgrade --install nats ./helm/nats
helm upgrade --install orders ./helm/orders
helm upgrade --install orders-mongo ./helm/orders-mongo
helm upgrade --install payments ./helm/payments
helm upgrade --install payments-mongo ./helm/payments-mongo
helm upgrade --install tickets ./helm/tickets
helm upgrade --install tickets-mongo ./helm/tickets-mongo

kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_51Q9sAnJjSLz1mauE30A8M3UYrTTfojZkANM6OLZFHxLgs4JWW9Ousezym7rFmRogkrfCgjABQN2fqq1TLxIPmkv200XZfox3xg -n ticketing

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret_value -n ticketing

kubectl get all -n ticketing  

helm install ticketing ./helm --namespace ticketing

