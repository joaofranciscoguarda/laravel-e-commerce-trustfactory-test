<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->string('batch_number')->unique();
            $table->integer('initial_quantity');
            $table->integer('remaining_quantity');
            $table->decimal('cost_price', 10, 2);
            $table->date('received_date');
            $table->date('expiry_date')->nullable();
            $table->timestamps();

            $table->index(['item_id', 'remaining_quantity']);
            $table->index(['item_id', 'received_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_batches');
    }
};
