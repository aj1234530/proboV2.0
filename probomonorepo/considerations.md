1. should be add another backend for handling api that interacts with db directly
   1. eg - signup
   2. balance ramp up
   3. because if the worker is there which interact via queue , there user will not be there for response recieving more than 30 sec , and what is worker dies and comes back - it will process task but no one listening- reduntant