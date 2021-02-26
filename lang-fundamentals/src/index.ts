import { test_generics } from "./generics";
import { test_enum } from "./enum";
import { test_basics } from "./basics";
import { test_unions } from "./unions";
import { testFunctionAfromMouduleA } from "./moduleA/fileA";
import { test_lambdas } from "./lambdas";
import { test_functions } from "./functions";

test_basics();
test_enum();
test_unions();
test_generics();
test_lambdas();
test_functions();
testFunctionAfromMouduleA();
