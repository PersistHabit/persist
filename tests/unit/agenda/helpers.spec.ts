import { test } from "@japa/runner";
import {
	daysToNumberMap,
	numberToDaysMap,
} from "../../../app/helpers/agenda.js";

test.group("Agenda helpers — daysToNumberMap", () => {
	test("converts each weekday slug to the correct JS day number", ({
		assert,
	}) => {
		assert.equal(daysToNumberMap(["mon"])[0], 1);
		assert.equal(daysToNumberMap(["tue"])[0], 2);
		assert.equal(daysToNumberMap(["wed"])[0], 3);
		assert.equal(daysToNumberMap(["thu"])[0], 4);
		assert.equal(daysToNumberMap(["fri"])[0], 5);
		assert.equal(daysToNumberMap(["sat"])[0], 6);
		assert.equal(daysToNumberMap(["sun"])[0], 0);
	});

	test("handles multiple days preserving order", ({ assert }) => {
		assert.deepEqual(daysToNumberMap(["mon", "wed", "fri"]), [1, 3, 5]);
	});

	test("returns empty array for empty input", ({ assert }) => {
		assert.deepEqual(daysToNumberMap([]), []);
	});
});

test.group("Agenda helpers — numberToDaysMap", () => {
	test("converts each JS day number to the correct weekday slug", ({
		assert,
	}) => {
		assert.equal(numberToDaysMap([0])[0], "sun");
		assert.equal(numberToDaysMap([1])[0], "mon");
		assert.equal(numberToDaysMap([2])[0], "tue");
		assert.equal(numberToDaysMap([3])[0], "wed");
		assert.equal(numberToDaysMap([4])[0], "thu");
		assert.equal(numberToDaysMap([5])[0], "fri");
		assert.equal(numberToDaysMap([6])[0], "sat");
	});

	test("handles multiple numbers preserving order", ({ assert }) => {
		assert.deepEqual(numberToDaysMap([1, 3, 5]), ["mon", "wed", "fri"]);
	});

	test("returns empty array for empty input", ({ assert }) => {
		assert.deepEqual(numberToDaysMap([]), []);
	});
});

test.group("Agenda helpers — round-trip", () => {
	test("daysToNumberMap then numberToDaysMap is identity", ({ assert }) => {
		const slugs = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
		assert.deepEqual(numberToDaysMap(daysToNumberMap([...slugs])), [...slugs]);
	});
});
