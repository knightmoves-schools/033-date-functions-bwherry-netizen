--this should ensure we preserve the same expire dates relative to the day the test is being ran
UPDATE Grocery
SET NEXT_EXPIRE_DATE = date(Grocery.NEXT_EXPIRE_DATE, '+'||(julianday(date()) -  julianday("2024-03-25"))||' days')